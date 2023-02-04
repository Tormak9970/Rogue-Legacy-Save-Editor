# Rogue Legacy Save Editor
A clean save editor for the Rogue Legacy games, powered by `TypeScript`, `Svelte`, and `Tauri`. The app offers a variety of features for editing, encoding and decoding saves for the game.
<br/>
<br/>

## Features
 - Save file decoding - Decodes a save file into a valid, editable `.json` file
 - Json to save file encoding - Encodes a json file to a valid game save.
 - Backups - A robust system to ensure that your saves are preserved in the case that that app or you breaks a save.

<br/>
This app aims to provide a nice UI for these tasks, as well as provide a command line interface (CLI) option for those who wish to automate the tasks or who are just power users.
<br/>
<br/>

## Installing
If you want to download the app and get started, grab the newest release [here](https://github.com/Tormak9970/Rogue-Legacy-Save-Editor/releases). If you would like to build the app yourself, keep reading to learn how.
<br/>
<br/>

## Building the app
**Please note:** you may edit and distrubute this program as you see fit but you must retain the license and the copyright notice I included (feel free to mark your contributions as I have)<br/>

### Setting Up the Enviroment
I used the Tauri framework for the program, so you will need to to setup your enviroment as specified [here](https://tauri.app/v1/guides/getting-started/prerequisites). Additionally, you need a [Node.js](https://nodejs.org/en/) installation, as well as `npm`, which should be included with the node install.

### Cloning the Program
The next step is to get a local copy of the repository. This can be done many ways, I recommend forking this repository and cloning that.<br/>
**IMPORTANT:**<br/>
If you make changes you are not allowed to redistribute the application with me labeled as the developer. Please remember to change the `author` information in the `package.json` and the related copyright information in `src-tauri/tauri.config.json` file. You should also change the copyright notice in `src/App.svelte`.

### Installing Dependencies
Once you have cloned the repository and opened it in your preffered Editor/IDE (I recommend [VSCode](https://code.visualstudio.com/)), you will need to install the program's dependencies. To do this, you will need to run two commands:<br/>
First:<br/>
```
npm i
```
Next:<br/>
```
cd src-tauri
cargo install
```

### Running the Application
Now you are finally ready to get the app up and running! Assuming everything is set up correctly, all you need to do is run:<br/>
```
npm run tauri dev
```

### Building With Your Changes
Once you have made your edits and are ready to share it with the world, run the following command:
```
npm run tauri build
```
This will generate a `.msi` file in `src-tauri/target/release/bundle/msi/app_name.msi`. And there you go, you've got a distributeable installer!
<br/>
<br/>

## Acknowledgements

<br/>
<br/>

## Licensing
This program is licensed under the [GNU General Public License Version 3](https://www.gnu.org/licenses/#GPL)
<br/>
<br/>
Copyright Travis Lane (Tormak) 2023