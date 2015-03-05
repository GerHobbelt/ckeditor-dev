Agoraa CKEditor
===============
> The [Agoraa](http://www.axonn.co.uk/agoraa) version of CKEditor - JavaScript WYSIWYG web text editor.

## Install
```bower install Axonn/ckeditor-agoraa --save```

##To create a new release
1. Run `npm install`
2. Run `bower install`
3. Make necessary changes to ckeditor e.g. plugins or skins on **agoraa-master** or another branch
4. If changing ckeditor config (adding or removing a plugin/changing skin) please change build-config.js located at /dev/builder/build-config.js
5. Run ```grunt build``` to build a release version of ckeditor. This will run /dev/builder/build.sh and copy necessary files to /dist for bower installs. NOTE: If you get error ```basename: too many arguments``` move your repo to a path that has no spaces and retry.
6. You can open "\ckeditorTester.html" to test the built ckeditor
7. Commit your changes including /dist changes and merge into agoraa-master if on another branch
8. Run ```grunt release``` (see more info here [https://github.com/geddski/grunt-release](https://github.com/geddski/grunt-release)) to automatically increment patch version in bower.json, tag and push to github. Other options include ```grunt release:minor```, ```grunt release:major``` and ```grunt release:prerelease``` NOTE: Ensure you have git added to your path
9. All that remains will be to update the version in bower.json in the app that is using ckeditor and run ```bower install```

##Plugins
* OEmbed plugin
See [https://github.com/Axonn/ckeditor-oembed-plugin](https://github.com/Axonn/ckeditor-oembed-plugin) for Agoraa forked version

CKEditor 4 - The best browser-based WYSIWYG editor
==================================================

## Development Code

This repository contains the development version of CKEditor.

**Attention:** The code in this repository should be used locally and for
development purposes only. We don't recommend distributing it on remote websites
because the user experience will be very limited. For that purpose, you should
build it (see below) or use an official release instead, available on the
[CKEditor website](http://ckeditor.com).

### Code Installation

There is no special installation procedure to install the development code.
Simply clone it on any local directory and you're set.

### Available Branches

This repository contains the following branches:

  - **master**: development of the upcoming minor release.
  - **major**: development of the upcoming major release.
  - **stable**: latest stable release tag point (non-beta).
  - **latest**: latest release tag point (including betas).
  - **release/A.B.x** (e.g. 4.0.x, 4.1.x): release freeze, tests and tagging.
    Hotfixing.

Note that both **master** and **major** are under heavy development. Their
code didn't pass the release testing phase so it may be unstable.

Additionally, all releases will have their relative tags in this form: 4.0,
4.0.1, etc.

### Samples

The `samples/` folder contains a good set of examples that can be used
to test your installation. It can also be a precious resource for learning
some aspects of the CKEditor JavaScript API and its integration on web pages.

### Code Structure

The development code contains the following main elements:

  - Main coding folders:
    - `core/`: the core API of CKEditor. Alone, it does nothing, but
    it provides the entire JavaScript API that makes the magic happen.
    - `plugins/`: contains most of the plugins maintained by the CKEditor core team.
    - `skin/`: contains the official default skin of CKEditor.
    - `dev/`: contains "developer tools".
    - `tests/`: contains CKEditor tests suite.

### Building a Release

A release optimized version of the development code can be easily created
locally. The `dev/builder/build.sh` script can be used for that purpose:

	> ./dev/builder/build.sh

A "release ready" working copy of your development code will be built in the new
`dev/builder/release/` folder. An internet connection is necessary to run the
builder, for its first time at least.

### Testing Environment

Read more on how to set up the environment and execute tests in the [CKEditor Testing Environment](http://docs.ckeditor.com/#!/guide/dev_tests) guide.

### License

Licensed under the GPL, LGPL and MPL licenses, at your choice.

For full details about the license, please check the LICENSE.md file.
