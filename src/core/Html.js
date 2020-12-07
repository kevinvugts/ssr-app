import React from 'react'

/*
  scripts an array of URLS. We map them into a series of scripts elements
  children contains the HTML markup string from the server we want to inject into the app container
  We use dangerouslySetInnerHTML cause we don't want the HTML to be escaped when injected
  This file will replace index.html
*/
const Html = ({ children, initialData, criticalCss, scripts }) => {
  return (
    <html>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="EnoRm - Server Side Rendered App " />
        <meta name="keywords" content="HTML,CSS,JavaScript,jQuery,XML,PHP" />
        <meta property="og:locale" content="nl_NL" />
        <meta property="og:title" content="EnOrm - Server Side Broski" />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://enorm.com/application/files/5615/4280/0141/EnoRm..png"
        />
        <meta property="og:site_name" content="Enorm SERVER APP" />
        <meta
          property="og:description"
          content="A mind-blowing mix of creative, tech and performance. To ensure your next-level website truly converts, your stunning branding gets the audience it deserves and your brilliant campaigns lead to interesting prospects."
        />

        <title>Server Side Rendered React App!!</title>
        <style>{[...criticalCss].join('')}</style>
      </head>
      <body>
        <div id="app" dangerouslySetInnerHTML={{ __html: children }} />

        {initialData && (
          <script
            dangerouslySetInnerHTML={{
              __html: `window.__REACT_QUERY_INITIAL_QUERIES__=${JSON.stringify(
                initialData
              )}`,
            }}
          />
        )}

        <script src="client.js" type="text/javascript" />
        <script src="vendor.js" type="text/javascript" />
      </body>
    </html>
  )
}

export default Html
