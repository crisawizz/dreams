/**
 * Simple text annotator in plain JavaScript
 * Usable for short texts only (but also for touch devices)
 *
 * possible enhancements:
 *   optimize span highlighting by indices
 *   spans are overlapping serif fonts like Times New Roman (e.g. letter f)
 *
 * Raimund Schnürer
 * ETH Zurich, 2018
 *
 * @version 1.0.2
 *
 * @param text - String: the text to be annotated
 * @param annotationTypes - Array of objects with keys 'label' (String), 'color' (String) and 'indices' (Array of Array of two Integers): the annotation options
 * @param highlightingColor - String: the color of highlighted text
 * @param textPanelId - String: id of the div where the text should be inserted
 * @param annotationTypePanelId - String: id of the div where the annotation options should be inserted
 */
function Annotator(text, annotationTypes, highlightingColor, textPanelId, annotationTypePanelId) {
    var self = this;
    var interpunctationSigns = [",", ".", ":", ";", " ", "(", ")", "[", "]", "{", "}", "?", "!"];
    var selectionActive = false;
    var clickedColor;
    var selectedColor;
    var moved, touched;

    var textElem = document.getElementById(textPanelId);
    var annotationTypesElem = document.getElementById(annotationTypePanelId);

    if (!textElem)
        console.warn("Cannot find text panel.");

    if (!annotationTypesElem)
        console.warn("Cannot find annotation types panel.");


    function annotationTypeChanged() {
        selectedColor = this.querySelector("input[type='radio']:checked").value;
    }

    function initialiseAnnotationTypes(annotationTypesElem, annotationTypes) {
        var annotationTypesString = "";

        annotationTypes.forEach(function(annotationType, index) {
            annotationTypesString += '<input type="radio" name="annotationTypes" id="radio-' + index + '" value="' + annotationType.color + '"/>';
            annotationTypesString += '<label for="radio-' + index + '" style="background-color: ' + annotationType.color + ';display:inline">' + annotationType.label + '</label>';
            annotationTypesString += '<br/>';
        });

        annotationTypesString = '<div>' + annotationTypesString + '</div>';
        annotationTypesElem.innerHTML = annotationTypesString;

        annotationTypesElem.onchange = annotationTypeChanged;

        var initialRadioButton = document.getElementById("radio-0");
        initialRadioButton.checked = true;

        return initialRadioButton.value;
    }

    function appendSpan(word, className, textElem) {
        if (word) {
            var span = document.createElement("span");
            span.innerText = word;
            span.className = className;

            textElem.appendChild(span);
        }
        return "";
    }

    function initialiseText(textElem, text) {
        var char;
        var word = "";
        var gap = "";

        for (var i = 0; i < text.length; i++) {
            char = text[i];

            if (interpunctationSigns.indexOf(char) == -1) {
                gap = appendSpan(gap, "gap", textElem);
                word += char;
            } else {
                word = appendSpan(word, "word", textElem);
                gap += char;
            }
        }
        appendSpan(word, "word", textElem);
        appendSpan(gap, "gap", textElem);
    }
    
    function initialiseSelections(textElement, annotationTypes) {
        annotationTypes.forEach(function(annotationType) {
            (annotationType.indices || []).forEach(function(indexPositions) {
                for (var i = indexPositions[0]; i < indexPositions[1]; i++) {
                    textElement.childNodes[i].style.backgroundColor = annotationType.color;
                }
            });
        });        
    }


    function getStartAndEnd(child1, child2) {
        var child1Index = Array.prototype.indexOf.call(textElem.childNodes, child1);
        var child2Index = Array.prototype.indexOf.call(textElem.childNodes, child2);

        return child1Index < child2Index ? [child1, child2] : [child2, child1];
    }

    //source: https://stackoverflow.com/questions/3169786/clear-text-selection-with-javascript
    function clearSelection() {
        if (window.getSelection) {
            if (window.getSelection().empty) {  // Chrome
                window.getSelection().empty();
            } else if (window.getSelection().removeAllRanges) {  // Firefox
                window.getSelection().removeAllRanges();
            }
        } else if (document.selection) {  // IE?
            document.selection.empty();
        }
    }

    function removeSelectedColor(span, siblingType, clickedColor) {
        while (true) {
            span.style.backgroundColor = "";

            span = span[siblingType];

            if (!span || span.style.backgroundColor != clickedColor)
                break;
        }
    }

    function highlightSpan(span) {
        var previousBackgroundColor = span.getAttribute("data-background-color");

        if (previousBackgroundColor === null) {
            span.setAttribute("data-background-color", span.style.backgroundColor);
            span.style.backgroundColor = highlightingColor;
        }
    }

    function dehighlightSpan(span) {
        var previousBackgroundColor = span.getAttribute("data-background-color");

        if (previousBackgroundColor !== null) {
            span.style.backgroundColor = previousBackgroundColor;
            span.removeAttribute("data-background-color");
        }
    }

    //workaround for Microsoft Edge (which returns either the span or the text node)
    function getParent(elem) {
        if (elem.tagName == "SPAN")
            return elem;

        return elem.parentNode;
    }

    function onMouseDown(elem) {
        //https://bugs.chromium.org/p/chromium/issues/detail?id=119216
        if (elem.target.nodeName != "SPAN" || touched)
            return;

        selectionActive = true;

        clickedColor = elem.target.style.backgroundColor;
    }

    function onSelectionChange() {
        if (!selectionActive)
            return;

        var selection = window.getSelection();

        if (!selection.anchorNode || !selection.focusNode)
            return;

        var anchorNodeParent = getParent(selection.anchorNode);
        var focusNodeParent = getParent(selection.focusNode);

        if (anchorNodeParent == focusNodeParent) {
            //highlighting of single word
            if (selection.anchorOffset != selection.focusOffset || anchorNodeParent.style.backgroundColor == "") {
                for (var i = 0; i < textElem.childNodes.length; i++) {
                    var child = textElem.childNodes[i];

                    if (child != anchorNodeParent)
                        dehighlightSpan(child);
                    else if (anchorNodeParent.className != "gap")
                        highlightSpan(child);
                }
            }
            return;
        }

        var highlightStart = false;

        //highlighting of multiple words
        for (var i = 0; i < textElem.childNodes.length; i++) {
            var child = textElem.childNodes[i];

            if (child == anchorNodeParent || child == focusNodeParent) {
                if (highlightStart) {
                    highlightStart = false;
                } else {
                    highlightStart = true;
                }

                if (child.className != "gap")
                    highlightSpan(child);
                else
                    dehighlightSpan(child);
                continue;
            }

            if (highlightStart)
                highlightSpan(child);
            else
                dehighlightSpan(child);
        }
    }

    function afterMouseUp() {
        clearSelection();
        clickedColor = undefined;

        var annotatedWords = self.getAnnotatedWords();
        self.annotationTypesChanged(annotatedWords);
    }


    function onMouseUp() {
        //https://bugs.chromium.org/p/chromium/issues/detail?id=119216
        if (!selectionActive || touched)
            return;

        selectionActive = false;
        
        var selection = window.getSelection();
        var anchorNodeSpan = getParent(selection.anchorNode);
        
        //single mouse click on annotated word
        if (!selection.anchorNode || !selection.focusNode || (selection.anchorNode == selection.focusNode && 
            selection.anchorOffset == selection.focusOffset && anchorNodeSpan.style.backgroundColor != highlightingColor)) {
            //remove selected color before and after
            removeSelectedColor(anchorNodeSpan, "previousSibling", clickedColor);
            removeSelectedColor(anchorNodeSpan, "nextSibling", clickedColor);
            
            afterMouseUp();
            return;
        }
        
        selectionEnd(selection, anchorNodeSpan);
    }
    
    function selectionEnd(selection, anchorNodeSpan) {
        //change highlight color to selected color
        for (var i = 0; i < textElem.childNodes.length; i++) {
            var child = textElem.childNodes[i];

            if (child.style.backgroundColor == highlightingColor) {
                child.style.backgroundColor = selectedColor;
                child.removeAttribute("data-background-color");
            }
        }

        //start and end might be swapped
        var nodes = getStartAndEnd(anchorNodeSpan, getParent(selection.focusNode));
        var startSpan = nodes[0];
        var endSpan = nodes[1];

        if (startSpan.className == "gap")
            startSpan = startSpan.nextSibling;

        if (endSpan.className == "gap")
            endSpan = endSpan.previousSibling;

        splitNeighbouringWordsEventually(startSpan, endSpan);

        afterMouseUp();
    }
    
    function splitNeighbouringWordsEventually(startSpan, endSpan) {
        if (startSpan.previousSibling && startSpan.previousSibling.style.backgroundColor != "")
            startSpan.previousSibling.style.backgroundColor = "";

        if (endSpan.nextSibling && endSpan.nextSibling.style.backgroundColor != "")
            endSpan.nextSibling.style.backgroundColor = "";
    }
    
    function onTouchStart(event) {
        moved = false;
        selectionActive = true;
        touched = true;
    }
    
    function onTouchMove(event) {    
        moved = true;
        touched = true;
    }
    
    function onTouchEnd(event) {
        touched = true;
        
        if (moved)
            return;
        
        //touchedElement equals touchedElement onTouchStart because otherwise onTouchMove was called
        var touchedElement = event.changedTouches.item(0).target;
        var selection = window.getSelection();
        
        selectionActive = false;
        moved = false;
        
        //single mouse click on annotated word        
        if (touchedElement && (!selection.anchorNode || !selection.focusNode || 
            (selection.anchorNode == selection.focusNode && selection.anchorOffset == selection.focusOffset))) {
            //click outside the text
            if (touchedElement.nodeName !== "SPAN")
                return;
                
            var clickedColor = touchedElement.style.backgroundColor;
                
            if (clickedColor) {
                removeSelectedColor(touchedElement, "previousSibling", clickedColor);
                removeSelectedColor(touchedElement, "nextSibling", clickedColor);
                
                //if (clickedColor != selectedColor)
                //    touchedElement.style.backgroundColor = selectedColor;
            } else if (touchedElement.className == "word" && !clickedColor) {
                touchedElement.style.backgroundColor = selectedColor;
                splitNeighbouringWordsEventually(touchedElement, touchedElement);
            }
                
            afterMouseUp();

            //document.getElementById("testDiv").innerText = JSON.stringify({"anchorNode": selection.anchorNode ? selection.anchorNode.data : "noData", "focusNode": selection.focusNode ? selection.focusNode.data : "noData", "anchorOffset": selection.anchorOffset, "focusOffset": selection.focusOffset});
        } else {
            var anchorNodeSpan = getParent(selection.anchorNode);
            selectionEnd(selection, anchorNodeSpan);
        }
    }

    initialiseText(textElem, text);
    initialiseSelections(textElem, annotationTypes);
    selectedColor = initialiseAnnotationTypes(annotationTypesElem, annotationTypes);

    window.onmousedown = onMouseDown;
    document.onselectionchange = onSelectionChange;
    window.onmouseup = onMouseUp;
    
    window.addEventListener("touchstart", onTouchStart, false);
    window.addEventListener("touchmove", onTouchMove, false);
    window.addEventListener("touchend", onTouchEnd, false);
    
    /**
     * called when annotations are changed
     * returns currently annotated words
     * @returns Array of objects with keys 'label' (String), 'color' (String), 'words' (Array of Strings)
     */
    this.annotationTypesChanged = function (annotationTypes) {};

    /**
     * returns currently annotated words
     * @returns Array of objects with keys 'label' (String), 'color' (String), 'words' (Array of Strings), 'indices' (Array of Array of two Integers)
     */
    this.getAnnotatedWords = function() {
        //clone object to avoid side effects
        var annotatedWords = JSON.parse(JSON.stringify(annotationTypes));
        var annotationTypesByColor = {};

        annotatedWords.forEach(function(annotationType) {
            annotationType.words = [];
            annotationType.indices = [];
            annotationTypesByColor[annotationType.color] = annotationType;
        });

        var previousColor = "";
        var word = "";
        var backgroundColor, child, startIndex;

        for (var i = 0; i < textElem.childNodes.length; i++) {
            child = textElem.childNodes[i];
            backgroundColor = child.style.backgroundColor;

            if (backgroundColor != "") {
                word += child.innerText;
                previousColor = backgroundColor;
                
                if (startIndex === undefined)
                    startIndex = i;
            } else {
                if (word) {
                    annotationTypesByColor[previousColor].words.push(word);
                    annotationTypesByColor[previousColor].indices.push([startIndex, i]);
                }

                word = "";
                previousColor = "";
                startIndex = undefined;
            }
        }

        if (word) {
            annotationTypesByColor[previousColor].words.push(word);
            annotationTypesByColor[previousColor].indices.push([startIndex, i]);
        }

        return annotatedWords;
    };
}
