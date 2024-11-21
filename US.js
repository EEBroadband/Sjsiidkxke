// ==UserScript==
// @name         Gansta Rap
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  nothing
// @author       Ice Cube
// @match        https://app.sparxreader.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    console.log('Tampermonkey script is running'); // Debugging log to confirm script execution

    // Function to create a button
    function createButton(buttonText, topPosition) {
        const button = document.createElement('button');
        button.textContent = buttonText;
        button.style.position = 'fixed';
        button.style.right = '10px';
        button.style.zIndex = '1000';
        button.style.padding = '10px 15px';
        button.style.backgroundColor = '#007bff';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.top = topPosition + 'px';
        return button;
    }

    // Function to copy text with a header
    function copyTextWithHeader(text, header) {
        if (!text) {
            alert('No text to copy.');
            return;
        }
        const textToCopy = header + "\n\n" + text;
        navigator.clipboard.writeText(textToCopy).then(() => {
            console.log('Text copied:', textToCopy); // Log the copied text
        }).catch(err => {
            alert('Failed to copy text: ' + err);
            console.error('Copy failed:', err); // Log the error
        });
    }

    // Function to format options with A, B, C, D, E
    function formatOptions(optionsDiv) {
        const optionLetters = ['A', 'B', 'C', 'D', 'E'];
        const buttons = optionsDiv.querySelectorAll('button');
        let formattedOptions = "";

        buttons.forEach((button, index) => {
            const optionText = button.textContent.trim();
            if (optionText) {
                // Add a new line after each option
                formattedOptions += `${optionLetters[index]}: ${optionText}\n`;
            }
        });
        return formattedOptions.trim();  // Remove extra newline at the end
    }

    // Function to format text with line spacing
    function formatTextWithLineSpacing(text) {
        const lines = text.split('\n').map(line => line.trim());
        return lines.join('\n\n'); // Adds an extra line space between lines
    }

    // Wait for the DOM to fully load
    window.addEventListener('load', function() {
        console.log('Page loaded, running script...'); // Debugging log

        // Create the "Copy Question and Options" button
        const copyQuestionOptionsButton = createButton('Copy Question & Options', 50);
        copyQuestionOptionsButton.addEventListener('click', function() {
            const questionDiv = document.querySelector("#root > div._App_xxadk_1 > div.view-container.right > div > div:nth-child(2) > div > div > div > div > h2");
            const optionsDiv = document.querySelector("#root > div._App_xxadk_1 > div.view-container.right > div > div:nth-child(2) > div > div > div > div > div");

            let questionText = "";
            if (questionDiv) {
                questionText = questionDiv.textContent;
            } else {
                alert('Question div not found.');
            }

            let formattedOptions = "";
            if (optionsDiv) {
                formattedOptions = formatOptions(optionsDiv);
            } else {
                alert('Options div not found.');
            }

            const finalText = [
                questionText ? "QUESTION:\n\n" + questionText : "",
                formattedOptions ? "OPTIONS:\n\n" + formattedOptions : ""
            ].join("\n\n");

            copyTextWithHeader(finalText, "QUESTION & OPTIONS:");

        });

        // Create the "Copy Text" button
        const copyTextButton = createButton('Copy Text', 90);
        copyTextButton.addEventListener('click', function() {
            const textDiv = document.querySelector(".read-content");

            let textContent = "";
            if (textDiv) {
                const startMarker = 'Start reading here';
                const endMarker = 'Stop reading here';
                const startIndex = textDiv.textContent.indexOf(startMarker);
                const endIndex = textDiv.textContent.indexOf(endMarker, startIndex);

                if (startIndex !== -1 && endIndex !== -1) {
                    textContent = textDiv.textContent.substring(startIndex + startMarker.length, endIndex).trim();
                    textContent = "CONTEXT:\n\n" + formatTextWithLineSpacing(textContent);
                } else {
                    alert('Markers not found in the text.');
                }
            } else {
                alert('Text div not found.');
            }

            copyTextWithHeader(textContent, "CONTEXT:");
        });

        // Append buttons to the body
        document.body.appendChild(copyQuestionOptionsButton);
        document.body.appendChild(copyTextButton);

        console.log('Copy buttons added to the page'); // Log when the buttons are added
    });
})();
