console.log("quest.js loaded");

quest = function() {
    //ini
};

quest.render = txt => {
    var html = "";
    var txt0 = txt;

    // remove blocked out
    txt = txt.replace(/\/\*[\s\S]+\*\//g, "");
    txt = txt.replace(/\/\/.*\n/g, "");

    // separate  questions
    txt = txt.split(/\n\n/).map(qq => {
        qq = qq.split("\n");
        if (qq.length > 1) {
            html += `<div>${qq[0]}`;
            qq.slice(1).forEach(q => {
                html += `<p>${q}</p>`;
            });
            html += "</div>";
        }
    });

    let regEx = new RegExp('\\[([A-Z][A-Z0-9_]*)\\](.*?)(?=\\[[A-Z]|<END>)', "msg")


    html = html.replace(regEx, function(x, y, z) {

        // replace |__|__|  with a number box...
        z = z.trim().replace(/\|(__\|)+/, "<input type='number' name='" + y + "'></input>");

        // replace [text box:xxx] with a textbox
        z = z.replace(/\[text\s?box:?(\w+)?\]/g, "<textbox name='$1'>")

        // replace (XX) with a radio button...
        z = z.replace(/\((\w*)\)([^<\n]*)/g, "<input type='radio' name='" + y + "' value='$1' id='" + y + "_$1'></input><label for='" + y + "_$1'>$2</label>");

        // replace [a-zXX] with a checkbox box...
        z = z.replace(/\[(\w*)\]([^<\n]*)/g, "<input type='checkbox' name='" + y + "' value='$1' id='" + y + "_$1'></input><label for='" + y + "_$1'>$2</label>");

        // replace user profile variables...
        z = z.replace(/{\$u:(\w+)}/, "<span name='$1'>$1</span>");

        // handle skips
        z = z.replace(/<input (.*?)><\/input>(.*?)->\s*(.*)/g, "<input $1 skipTo='$3'></input>$2")

        var rv =
            "<div class='question' id='" + y + "'>" + z + "\n" +
            "<input type='button' onclick='prev(this)' class='previous' value='previous'></input>\n" +
            "<input type='button' onclick='next(this)' class='next' value='next'></input>\n" +
            "</div>\n";

        return (rv)
    })

    // handle the display if case...
    html = html.replace(/\[DISPLAY IF\s*([A-Z][A-Z0-9+]*)\s*=\s*\(([\w,\s]+)\)\s*\]\s*<div (.*?)>/gms, "<div $3 showIfId='$1' values='$2'>");

    // remove the first previous button...
    html = html.replace(/<input.*class='previous'.*?\n/, "");
    // remove the last next button...
    html = html.replace(/<input.*class='next'.*?\n(?=<\/div>\n<END>)/, "");

    // remove the hidden end tag...    
    html = html.replace("<END>", "");

    // add the HTML/HEAD/BODY tags...
    html = '<html><head><link rel="stylesheet" type="text/css" href="Questionnaire.css"></head><body>' + html + '\n<script src="questionnaire.js"></script></body>';

    // console.log("\n\n\n" + html);

    // ---- html elements ---- //

    // while (html.search(/\[[A-Z][A-Z0-9]+]/) != -1) {

    //     let word = html.match(/\[[A-Z][A-Z0-9]+]/)[0];

    //     html = html.replace("<div>", "<div id='" + word.substr(1, word.length - 2) + "' class='question'>");

    //     html = html.replace(word, "")

    // }

    // while (html.search(/\[[a-z0-9][a-zA-Z0-9_]*]/) != -1) {
    //     let term = html.match(/\[[a-z0-9][a-zA-Z0-9_]*]/)[0];
    //     html = html.replace(term, "<input type='checkbox' value='" + term.substr(1, term.length - 2) + "'>")
    //     html = html.replace(term, "")
    // }

    // while (html.search(/\([a-z0-9][a-zA-Z0-9]*\)/) != -1) {
    //     let term = html.match(/\([a-z0-9][a-zA-Z0-9]*\)/)[0];
    //     html = html.replace(term, "<input type='radio' value='" + term.substr(1, term.length - 2) + "'>")
    //     html = html.replace(term, "")
    // }

    // html = html.replace(/\[DISPLAY \w*\]/g, "")

    // html = html.replace(/... GO TO /g, " -> ");
    // html = html.replace(/\* NO RESPONSE | NO RESPONSE/g, "");

    // // Create skip tags
    // const skips = html.match(/\* NO RESPONSE -> [A-Z0-9]+ | -> [A-Z0-9]+/g);

    // if (skips === null) {
    //     null
    // } else {

    //     for (i = 0; i < skips.length; i++) {
    //         let word = skips[i];
    //         html = html.replace(word, "<skip id='" + word.substr(4) + "'>");
    //     }
    // }

    // // Check Box []
    // html = html.replace(/\*/g, "[]");
    // html = html.replace(/\[\]/g, '<input type="checkbox">');

    // // Radio Button ()
    // html = html.replace(/\(\)/g, '<input type="radio">');


    // // Year |__|__|__|__|
    // html = html.replace(/\|__\|__\|__\|__\|/g, "|_|");

    // // Age |__|__|
    // html = html.replace(/\|__\|__\|/g, "|_|");

    // // Integer |_|
    // html = html.replace(/\|_\|/g, "<input type='number'>");


    // // Regular input field |__|
    // html = html.replace(/\|__\|/g, "<input>");

    // // Text Area |___|
    // html = html.replace(/\[text box\]/g, "|___|");
    // html = html.replace(/\|___\|/g, "<textarea></textarea>");

    // Phone Number |(###)-###-####|
    html = html.replace(
        /\|\(\###\)\-###-####\|/g,
        "<input type='tel' id='phone' name='phone' pattern='(((d{3}) ?)|(d{3}-))?d{3}-d{4}'>"
    );

    // Social Security |###-##-####|
    html = html.replace(
        /\|###-##-####\|/g,
        "<input type='tel' id='social' name='social' pattern='^(?!219099999|078051120)(?!666|000|9d{2})d{3}(?!00)d{2}(?!0{4})d{4}$'>"
    );

    return html + "<hr>"; //+txt0
};

quest.tout = function(fun, tt = 500) {
    if (quest.tout.t) {
        clearTimeout(quest.tout.t)
    }
    quest.tout.t = setTimeout(fun, tt)
}

class Questionnaire {}