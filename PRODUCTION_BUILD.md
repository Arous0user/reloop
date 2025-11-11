# How to Create and Serve a Production Build

The recent Lighthouse report indicates that the application is being served in **development mode**. This is the primary cause of many of the performance issues, including unminified code, large bundle sizes, and inefficient caching.

To resolve these issues, you need to create a production-ready build of your frontend application and serve it with your backend server.

## 1. Create a Production Build

First, you need to create an optimized production build of your React application. This process will minify your code, remove development-only features, and create a highly optimized version of your application.

To do this, navigate to the `frontend` directory in your terminal and run the following command:

```bash
npm run build
```

This command will create a `build` directory inside your `frontend` directory. This `build` directory contains the production-ready static files of your application.

## 2. Serve the Production Build

Your backend Express server is already configured to serve the contents of the `frontend/build` directory. To serve the production build, you need to:

1.  **Ensure the backend server is running.** If it's not running, navigate to the `backend` directory and start it:
    ```bash
    # In the backend directory
    node src/server.js
    ```

2.  **Access the application in your browser.** Open your web browser and navigate to the address of your backend server (e.g., `http://localhost:5002`).

By following these steps, you will be serving the optimized production build of your application, which should significantly improve your Lighthouse scores for performance, accessibility, and SEO.

## Summary of Expected Improvements:

*   **Minified JavaScript and CSS:** The production build will automatically minify your code, reducing file sizes and improving load times.
*   **Reduced Unused JavaScript:** The build process will tree-shake and remove unused code, resulting in a smaller, more efficient application bundle.
*   **Efficient Cache Lifetimes:** The Express server is configured to set long-term caching headers for the production build's static assets, which will speed up repeat visits.
*   **No WebSocket Issues:** The production build does not use WebSockets for hot-reloading, which will resolve the back/forward cache issue.
*   **Improved LCP and FCP:** By serving an optimized build, the Largest Contentful Paint (LCP) and First Contentful Paint (FCP) should be significantly faster.

After following these steps, you can run the Lighthouse audit again to see the improvements.