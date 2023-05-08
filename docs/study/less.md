# less工程化

> less官网 [https://lesscss.org/](https://lesscss.org/)

> less民间中文网[https://less.bootcss.com/](https://less.bootcss.com/)

```sh

npm install less -D
npx lessc styles.less styles.css

```

**变量**
```css
/**用#开始**/

```
**嵌套**

```css
/**用&连接**/
/**用>连接**/

```

**混合**

```less
containerCenter() {
  display: flex;
  justify-content:center;
  align-item: center;
}

borderRadius(@r: 5px) {
  border-radius: @r
}

.container {
  containerCenter();
  borderRadius();
}
```
**注释**