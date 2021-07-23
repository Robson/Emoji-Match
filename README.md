# Emoji Match

## 📃 Table of Contents

 * [Demo](#%EF%B8%8F-demo)
 * [Explanation](#ℹ️-explanation)
 * [Live Version](#%EF%B8%8F-live-version)
 * [Compatibility](#%EF%B8%8F-compatibility)
 * [Testing](#-testing) 
 * [File Descriptions](#%EF%B8%8F-file-descriptions)
 * [Technologies](#%EF%B8%8F-technologies)
 * [Validation](#-validation)

## 🎞️ Demo

(to-do)
 
## ℹ️ Explanation

Emoji Match is a game for 2+ players, where one person secretly chooses an emoji, then everyone else works together to figure out what it is.

The game is played using a browser and is designed to be played with everyone in the same room or via screen-sharing.

## 🕹️ Live Version

https://robson.plus/emoji-match/

## ☑️ Compatibility

The output for this project is designed for desktop only. Mobile is not supported yet.

| Platform | OS      | Browser          | Version | Status  |
| :------- | :------ | :--------------- | :------ | :------ |
| Desktop  | Windows | Firefox          | 89      | Working |
| Desktop  | Windows | Opera            | 77      | Working |
| Desktop  | Windows | Chrome           | 91      | Working |
| Desktop  | Windows | Edge             | 91      | Working |

The only difference between browsers is that some (Opera, Chrome, etc) do not render flag emojis, so the flag emojis are hidden for users of those browsers.

Last tested on 17th July 2021.

## 🐛 Testing

To run this on your computer:
 * [Download the repository](https://github.com/Robson/Emoji-Match/archive/master.zip).
 * Unzip anywhere.
 * Open index.html in your browser.

## 🗄️ File Descriptions

### index.html + page.js

These are responsible for creating and playing the game.

### style.css

All formatting and layout information is contained in this file.

### emojis.js

This contains the list of categories and then a massive list of emojis. Each emoji has a list of the categories that it belongs to. Each emoji also has a short description of what it is, although that is not used by the game.

## 🖥️ Technologies

This is built using:
 * HTML
 * CSS
 * JavaScript
   * <a href="https://github.com/d3/d3">D3.js</a>
   
## ✅ Validation
   
<a href="https://validator.w3.org/nu/?doc=https%3A%2F%2Frobson.plus%2Femoji-match%2F"><img src="https://www.w3.org/Icons/valid-html401-blue" alt="Valid HTML" /></a>
<a href="http://jigsaw.w3.org/css-validator/validator?uri=https%3A%2F%2Frobson.plus%2Femoji-match%2Fstyle.css&profile=css3svg&usermedium=all&warning=1"><img src="https://jigsaw.w3.org/css-validator/images/vcss-blue" alt="Valid CSS" /></a>      