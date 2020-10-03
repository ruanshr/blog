# next-tick

nextTick 是Vue的一个核心实现。
$nextTick 是在下次 DOM 更新循环结束之后执行延迟回调，在修改数据之后使用 $nextTick，则可以在回调中获取更新后的 DOM

### Vue的实现

从Vue源码 src/core/util/next-tick.js 中：
```js

import { noop } from 'share/util
import { handleError } from './error'
import { isIOS, isNative } from './env

const callbacks = []
let pending = false

function flushCallbacks(){
    pending = false
    const copies = callbacks.slice(0)
    callbacks.length = 0
    for(let i = 0; i < copies.length ;i++) {
        copies[i]()
    }
}

//	Here	we	have	async	deferring	wrappers	using	both	microtasks	and	(macro)	tasks. 
//	In	<	2.4	we	used	microtasks	everywhere,	but	there	are	some	scenarios	where 
//	microtasks	have	too	high	a	priority	and	fire	in	between	supposedly 
//	sequential	events	(e.g.	#4521,	#6690)	or	even	between	bubbling	of	the	same 
//	event	(#6566).	However,	using	(macro)	tasks	everywhere	also	has	subtle	problems 
//	when	state	is	changed	right	before	repaint	(e.g.	#6813,	out-in	transitions). 
//	Here	we	use	microtask	by	default,	but	expose	a	way	to	force	(macro)	task	when 
//	needed	(e.g.	in	event	handlers	attached	by	v-on). 
//	in	IE.	The	only	polyfill	that	consistently	queues	the	callback	after	all	DOM 
//	events	triggered	in	the	same	loop	is	by	using	MessageChannel. 
/*	istanbul	ignore	if	*/ 

let microTimerFunc
let macroTimerFunc
let useMacroTask  = false

//	Determine	(macro)	task	defer	implementation. //	Technically	setImmediate	should	be	the	ideal	choice,	but	it's	only	available
// nextTick
// 134
//	in	IE.	The	only	polyfill	that	consistently	queues	the	callback	after	all	DOM 
//	events	triggered	in	the	same	loop	is	by	using	MessageChannel. 
/*	istanbul	ignore	if	*/ 

if(typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
    macroTimerFunc = () => {
        setImmediate(flushCallbacks)
    }
} else if(typeof MessageChannel !== 'undefined' && (isNative(MessageChannel) || 
// PhantomJs
MessageChannel.toString() === '[Object MessageChannelConstructor]')) {
    const channel = new MessageChannel()
    const port = channel.port2
    channel.port1.onmessage = flushCallbacks
    macroTimerFunc = () => {
        port.postMessage(1)
    }
} else {
    macroTimerFunc = () => {
        setTimeout(flushCallbacks, 0)
    }
}

//	Determine	microtask	defer	implementation. 
/*	istanbul	ignore	next,	$flow-disable-line	*/

if (typeof Promise !== 'undefined' && isNative(Promise)) {
    const p = Promise.resolve()
    microTimerFunc = () => {
        p.then(flushCallbacks)
        	//	in	problematic	UIWebViews,	Promise.then	doesn't	completely	break,	but				
            //	it	can	get	stuck	in	a	weird	state	where	callbacks	are	pushed	into	the				
            //	microtask	queue	but	the	queue	isn't	being	flushed,	until	the	browser				
            //	needs	to	do	some	other	work,	e.g.	handle	a	timer.	Therefore	we	can				
            //	"force"	the	microtask	queue	to	be	flushed	by	adding	an	empty	timer.
            if (isIOS) setTimeout(noop)	
    }
} else {
    // fallback to macro
    microTimerFunc = macroTimerFunc
}

/**	
  *	Wrap	a	function	so	that	if	any	code	inside	triggers	state	change,	
  *	the	changes	are	queued	using	a	(macro)	task	instead	of	a	microtask.	
  */

export function withMacroTask (fn: Function): Function {
    return fn._withTask || (fn._withTask = function () {
        useMarcoTask = true
        const res = fn.apply(null, arguments)
        useMacroTask = false
        return res
    })
}


export function nextTick(fn?: Function, ctx?: Object) {
    let _resolve
    callbacks.push(() => {
        if (cb) {
            try {
                cb.call(ctx)
            } catch(e) {
                handleError(e, ctx, 'nextTick')
            }
        } else if( _resolve) {
            _resolve(ctx)
        }
    })
    if (!pending) {
        pending = true
        if (useMacroTask) {
            macroTimerFunc()
        } else {
            micorTimerFunc()
        }
    }
    if(!cb && typeof Promise !== 'undefined') {
        return new Promise(resolve => {
            _resolve = resolve
        })
    }
}
```

next-tick.js申明了microTimerFunc 和 macroTimerFunc 2 个变量，他们分别对应的是micro task的函数和marco task 的函数。对于macro task的实现，优先检查是否支持原生的setImmediate，这是一个高版本IE和Edge才支持的特性，不支持的话再去检测是否支持原生的MessageChannel，如果也不支持的话就会降级为setTimeout; 而对于micro task的实现，则检测浏览器是否原生支持Promise，不支持的话直接指向macro task的实现。

mext-tick.js对外暴露了2个函数，先来看nextTick，这就是我们执行nextTick(flushScheduleQueue) 所用到的函数，他的逻辑是把传入的回调函数cb压入callbacks数组，最后一次性地根据useMacroTask条件执行marcoTimerFunc或者microTimerFunc，而他们都会在下一个tick执行flushCallbacks。flushCallbacks的功能为遍历callbacks，然后执行相应的回调函数。

这里使用callbacks而不是直接在nextTick中执行回调函数的原因是保证在同一个tick内多次执行nextTick，不会开启多个异步任务，而是把这些异步任务都压成一个同步任务，在下一个tick执行完毕

nextTick函数最后还有一段逻辑：
```js

if(!cb && typeof Promise !== 'undefined') {
    return new Promise( resolve => {
        _resolve = resolve
    })
}

```

这是当nextTick不传cb参数的时候，提供一个Promise化的调用，比如：
```js

nextTick().then( () => {})

```

当_resolve函数执行，就会跳到then的逻辑中。

next-tick.js还对外暴露了withMacroTack函数，它是堆函数做一层保证，确保函数执行过程中对数据任意的修改，触发变化执行nextTick的时候强制走nacroTimerFunc。比如对于一些DOM交互事件，如v-on 绑定的事件回调函数和处理，会强制轴marco task


Vue.js提供了2种调用nextTick的方法，一种是全局API  Vue.nextTick，一种是实例上的方法 vm.$nextTick