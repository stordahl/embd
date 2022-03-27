# {{name}}

{{description}}

## Development

To run the esbuild dev server...

```shell
npm run dev
```

## Build for Production

```shell
npm run build
```

Then use your widget...

```html
<div id="target-div" />
<script src='dist/bundle.js'></script>
<script>
  const widget = new {{capital name}}.Widget({
    target: "target-div",
    props: {
      text: "Click Me",
      callback: () => alert('Passing a callback!')
    }
  })
</script>

```