
Notes on Bootstrap and React-Bootstrap dependencies

1) for specific components like Grid and Card, we need to import and render in react using the updated syntax

2) things like font colour, flex box, still work --> could it be because Bootstrap 5.1.3 was installed as dev-dependency? or that style sheet to Bs5.1.3 is linked from the html?
--> tested... bootstrap5.1.3 npm package was uninstalled and Bootstrap Flex 
    syntax stilled worked in react component

--> on removal of stylesheet link to Bs 5.1.3 css, bootstrap flex syntax in react component stops working
