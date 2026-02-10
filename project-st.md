
# Project Structure

```
E:\ApexCore\ApexDev\MERN\nevinas_ka_i\
├───start-gallery.bat
├───sync-images.bat
├───client\
│   ├───.gitignore
│   ├───eslint.config.js
│   ├───index.html
│   ├───package-lock.json
│   ├───package.json
│   ├───README.md
│   ├───tsconfig.app.json
│   ├───tsconfig.json
│   ├───tsconfig.node.json
│   ├───vite.config.ts
│   ├───public\
│   │   └───vite.svg
│   └───src\
│       ├───App.tsx
│       ├───index.css
│       ├───main.tsx
│       ├───assets\
│       │   ├───react.svg
│       │   ├───audio\
│       │   │   ├───A_night_on_the_town_-_Stefan_Kartenberg.mp3
│       │   │   ├───When_Paris_is_Singing_-_Dazie_Mae.mp3
│       │   │   └───Why_We_-_JO.BITE.mp3
│       │   ├───image\
│       │   │   ├───castorice.png
│       │   │   ├───feixiao.png
│       │   │   ├───logo.jpg
│       │   │   ├───nevinas.jpg
│       │   │   ├───react.svg
│       │   │   ├───work-1.jpg
│       │   │   ├───work-2.jpg
│       │   │   ├───work-3.jpg
│       │   │   └───work-4.jpg
│       │   └───pdf\
│       │       └───resume-nevinas-ka.pdf
│       ├───components\
│       │   ├───card\
│       │   │   ├───BlogCard.tsx
│       │   │   ├───RepoCard.tsx
│       │   │   └───StatsCard.tsx
│       │   ├───charts\
│       │   │   └───TechStackCharts.tsx
│       │   ├───common\
│       │   │   ├───BlogPostPage.tsx
│       │   │   ├───LoadingSpinner.tsx
│       │   │   ├───client-error\
│       │   │   │   └───NotFound.tsx
│       │   │   └───server-error\
│       │   │       ├───GatewayTimeout.tsx
│       │   │       ├───ServerError.tsx
│       │   │       └───ServiceUnavailable.tsx
│       │   ├───layouts\
│       │   │   ├───Footer.tsx
│       │   │   ├───Header.tsx
│       │   │   ├───Navbar.tsx
│       │   │   └───Sidebar.tsx
│       │   └───ui\
│       │       ├───Error.tsx
│       │       └───Loading.tsx
│       ├───context\
│       │   ├───ProfileContext.tsx
│       │   └───ThemeContext.tsx
│       ├───data\
│       │   ├───blogPosts.ts
│       │   └───HomeData.ts
│       ├───layouts\
│       │   └───WorkLayout.tsx
│       ├───pages\
│       │   ├───BlogPage.tsx
│       │   ├───Dashboard.tsx
│       │   ├───Docs.tsx
│       │   ├───Gallery.tsx
│       │   ├───Performance.tsx
│       │   ├───ReactPage.tsx
│       │   ├───Repository.tsx
│       │   ├───TailwindPage.tsx
│       │   ├───TechStack.tsx
│       │   ├───Tooling.tsx
│       │   ├───Website.tsx
│       │   └───homepage\
│       │       ├───HomePage.tsx
│       │       └───components\
│       │           ├───About.tsx
│       │           ├───Contact.tsx
│       │           ├───Services.tsx
│       │           └───Work.tsx
│       ├───routes\
│       │   └───AppRoutes.tsx
│       ├───styles\
│       │   ├───globals.css
│       │   ├───responsive.css
│       │   ├───scrollbar.css
│       │   └───components\
│       │       ├───animations.css
│       │       ├───blog.css
│       │       ├───card.css
│       │       ├───loading.css
│       │       └───socalmedia.css
│       ├───types\
│       │   ├───blog.ts
│       │   ├───homeData.ts
│       │   └───sidebar.ts
│       └───utils\
│           ├───fetchRepositories.tsx
│           └───getErrorMessage.tsx
├───docs\
│   ├───backend\
│   │   ├───database.md
│   │   └───QUICK_START_GUIDE.md
│   └───frontend\
│       ├───DASHBOARD_CODE_EXAMPLES.md
│       ├───DASHBOARD_UPDATE_SUMMARY.md
│       ├───DASHBOARD_VISUAL_GUIDE.md
│       ├───GALLERY-README.md
│       ├───gallery-setup.md
│       └───README_DASHBOARD_UPDATE.md
└───server\
    ├───.env
    ├───.env.example
    ├───debug.log
    ├───package-lock.json
    ├───package.json
    ├───src\
    │   ├───seed.js
    │   ├───server.js
    │   ├───data\
    │   │   ├───blog.json
    │   │   └───project.json
    │   ├───debug\
    │   │   └───debugGallery.js
    │   ├───middleware\
    │   │   └───auth.js
    │   ├───models\
    │   │   ├───Blog.js
    │   │   ├───Gallery.js
    │   │   ├───Project.js
    │   │   └───User.js
    │   ├───routes\
    │   │   └───auth.js
    │   └───sync\
    │       └───syncGallery.js
    └───uploads\
        └───images\
            ├───blog\
            ├───gallery\
            │   └───first\
            │       ├───000002.JPG
            │       ├───000003.JPG
            │       ├───000005.JPG
            │       ├───000006.JPG
            │       ├───000016.JPG
            │       ├───000017.JPG
            │       ├───000018.JPG
            │       ├───000019.JPG
            │       ├───000020.JPG
            │       ├───000021.JPG
            │       ├───000024.JPG
            │       ├───000025.JPG
            │       ├───000026.JPG
            │       ├───000027.JPG
            │       ├───000029.JPG
            │       ├───000030.JPG
            │       ├───000031.JPG
            │       ├───000032.JPG
            │       ├───000033.JPG
            │       ├───000034.JPG
            │       ├───000035.JPG
            │       ├───000036.JPG
            │       ├───000037.JPG
            │       ├───000038.JPG
            │       ├───000039.JPG
            │       ├───000040.JPG
            │       ├───000041.JPG
            │       ├───000042.JPG
            │       └───000043.JPG
            └───project\
```
