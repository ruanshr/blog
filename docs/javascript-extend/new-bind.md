# bind


```js

Function.prototype.myBind = function(context, ...args) {
    const self = this
    function Fn(...otherArgs) {
        const isNewCall = this instanceof Fn
        return self.apply(isNewCall ? this : context, args.concat(otherArgs))
    }
    Fn.prototype = Object.create(self.prototype)
    return Fn
}

```