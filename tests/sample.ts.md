# Literate Programming

support indent code blocks

    const a: number = 1;
    const b: 2 = 2;
       // ^?

also support tagging code blocks

```
const c = 3 as const;
const d = 4 as 4;
```

results:

    console.log(a + b + c + d) // 10

