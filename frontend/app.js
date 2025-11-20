// -----------------------------------------------------------------------------
// UI AND EXECUTION
// -----------------------------------------------------------------------------

const EXAMPLES = {
    HELLO: `ΑΛΓΟΡΙΘΜΟΣ Hello
ΑΡΧΗ
    ΤΥΠΩΣΕ("Hello World")
ΤΕΛΟΣ`,
    FIBONACCI: `ΑΛΓΟΡΙΘΜΟΣ Fibonacci
ΔΕΔΟΜΕΝΑ
    N, A, B, TEMP, I : ΑΚΕΡΑΙΟΣ;
ΑΡΧΗ
    ΤΥΠΩΣΕ("Δώσε αριθμό όρων:")
    ΔΙΑΒΑΣΕ(N)
    A := 0;
    B := 1;
    ΤΥΠΩΣΕ(A)
    ΤΥΠΩΣΕ(B)
    ΓΙΑ I := 3 ΕΩΣ N ΕΠΑΝΑΛΑΒΕ
        TEMP := A + B;
        ΤΥΠΩΣΕ(TEMP);
        A := B;
        B := TEMP
    ΓΙΑ-ΤΕΛΟΣ
ΤΕΛΟΣ`,
    BUBBLE_SORT: `ΑΛΓΟΡΙΘΜΟΣ BubbleSort
ΣΤΑΘΕΡΕΣ N = 5;
ΔΕΔΟΜΕΝΑ A: ARRAY[1..N] OF INTEGER; I, J, TEMP: INTEGER;
ΑΡΧΗ
    /* Είσοδος */
    ΓΙΑ I:=1 ΕΩΣ N ΕΠΑΝΑΛΑΒΕ
        A[I] := (N - I + 1) * 10
    ΓΙΑ-ΤΕΛΟΣ;
    
    /* Ταξινόμηση */
    ΓΙΑ I:=2 ΕΩΣ N ΕΠΑΝΑΛΑΒΕ
        ΓΙΑ J:=N ΕΩΣ I ΜΕ ΒΗΜΑ -1 ΕΠΑΝΑΛΑΒΕ
            ΕΑΝ A[J-1] > A[J] ΤΟΤΕ
                TEMP := A[J-1];
                A[J-1] := A[J];
                A[J] := TEMP
            ΕΑΝ-ΤΕΛΟΣ
        ΓΙΑ-ΤΕΛΟΣ
    ΓΙΑ-ΤΕΛΟΣ;

    /* Εκτύπωση */
    ΓΙΑ I:=1 ΕΩΣ N ΕΠΑΝΑΛΑΒΕ
        ΤΥΠΩΣΕ(A[I])
    ΓΙΑ-ΤΕΛΟΣ
ΤΕΛΟΣ`,
    AVERAGE: `ΑΛΓΟΡΙΘΜΟΣ Average
ΔΕΔΟΜΕΝΑ
    SUM, COUNT, NUM : ΠΡΑΓΜΑΤΙΚΟΣ;
ΑΡΧΗ
    SUM := 0;
    COUNT := 0;
    ΤΥΠΩΣΕ("Δώσε αριθμούς (0 για τέλος):")
    ΕΠΑΝΑΛΑΒΕ
        ΔΙΑΒΑΣΕ(NUM);
        ΕΑΝ NUM <> 0 ΤΟΤΕ
            SUM := SUM + NUM;
            COUNT := COUNT + 1
        ΕΑΝ-ΤΕΛΟΣ
    ΜΕΧΡΙ NUM = 0;
    
    ΕΑΝ COUNT > 0 ΤΟΤΕ
        ΤΥΠΩΣΕ("Μέσος Όρος:", SUM / COUNT)
    ΑΛΛΙΩΣ
        ΤΥΠΩΣΕ("Δεν δόθηκαν αριθμοί.")
    ΕΑΝ-ΤΕΛΟΣ
ΤΕΛΟΣ`
};

document.addEventListener('DOMContentLoaded', () => {
    const codeEditor = document.getElementById('code-editor');
    const lineNumbers = document.getElementById('line-numbers');
    const runButton = document.getElementById('run-button');
    const outputDisplay = document.getElementById('output-display');
    const exampleSelector = document.getElementById('example-selector');

    const updateLineNumbers = () => {
        const lines = codeEditor.value.split('\n').length;
        lineNumbers.innerHTML = Array(lines).fill(0).map((_, i) => i + 1).join('<br>');
    };

    codeEditor.addEventListener('input', updateLineNumbers);
    codeEditor.addEventListener('scroll', () => {
        lineNumbers.scrollTop = codeEditor.scrollTop;
    });

    // Initial update
    updateLineNumbers();

    // Enable Tab key support
    codeEditor.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = codeEditor.selectionStart;
            const end = codeEditor.selectionEnd;
            codeEditor.value = codeEditor.value.substring(0, start) + "\t" + codeEditor.value.substring(end);
            codeEditor.selectionStart = codeEditor.selectionEnd = start + 1;
            updateLineNumbers();
        }
    });

    // Example Selector
    exampleSelector.addEventListener('change', (e) => {
        const key = e.target.value;
        if (EXAMPLES[key]) {
            codeEditor.value = EXAMPLES[key];
            updateLineNumbers();
        }
    });

    runButton.addEventListener('click', () => {
        const pseudocode = codeEditor.value;
        outputDisplay.style.color = 'black';
        outputDisplay.textContent = 'Running...';
        try {
            const tokens = tokenize(pseudocode);
            const parser = new Parser(tokens);
            const ast = parser.parse();
            const interpreter = new Interpreter();
            const result = interpreter.interpret(ast);
            
            if (result.error) {
                 outputDisplay.textContent = `Execution Error:\n\n${result.error}`;
                 outputDisplay.style.color = 'red';
            } else {
                 outputDisplay.textContent = result.output;
            }

        } catch (error) {
            outputDisplay.textContent = `Parsing Error:\n\n${error.message}`;
            outputDisplay.style.color = 'red';
            console.error(error);
        }
    });
});
