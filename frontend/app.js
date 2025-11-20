// -----------------------------------------------------------------------------
// TOKENIZER
// -----------------------------------------------------------------------------
const TokenType = { ALGORITHM: 'ALGORITHM', CONSTANTS: 'CONSTANTS', DATA: 'DATA', BEGIN: 'BEGIN', END: 'END', IF: 'IF', THEN: 'THEN', ELSE: 'ELSE', FOR: 'FOR', TO: 'TO', STEP: 'STEP', REPEAT: 'REPEAT', WHILE: 'WHILE', UNTIL: 'UNTIL', ARRAY: 'ARRAY', OF: 'OF', TYPES: 'TYPES', PRINT: 'PRINT', READ: 'READ', CALCULATE: 'CALCULATE', PROCEDURE: 'PROCEDURE', FUNCTION: 'FUNCTION', INTERFACE: 'INTERFACE', INPUT: 'INPUT', OUTPUT: 'OUTPUT', MOD: 'MOD', DIV: 'DIV', AND: 'AND', OR: 'OR', NOT: 'NOT', EOLN: 'EOLN', POINTER: 'POINTER', LIST: 'LIST', INTEGER_TYPE: 'INTEGER_TYPE', REAL_TYPE: 'REAL_TYPE', BOOLEAN_TYPE: 'BOOLEAN_TYPE', CHAR_TYPE: 'CHAR_TYPE', STRING_TYPE: 'STRING_TYPE', ASSIGN: 'ASSIGN', PLUS: 'PLUS', MINUS: 'MINUS', MULTIPLY: 'MULTIPLY', DIVIDE: 'DIVIDE', EQUALS: 'EQUALS', LESS_THAN: 'LESS_THAN', GREATER_THAN: 'GREATER_THAN', LESS_EQUALS: 'LESS_EQUALS', GREATER_EQUALS: 'GREATER_EQUALS', NOT_EQUALS: 'NOT_EQUALS', LEFT_PAREN: 'LEFT_PAREN', RIGHT_PAREN: 'RIGHT_PAREN', LEFT_BRACKET: 'LEFT_BRACKET', RIGHT_BRACKET: 'RIGHT_BRACKET', COMMA: 'COMMA', COLON: 'COLON', SEMICOLON: 'SEMICOLON', DOT: 'DOT', CARET: 'CARET', PERCENT: 'PERCENT', NUMBER: 'NUMBER', STRING: 'STRING', IDENTIFIER: 'IDENTIFIER', EOF: 'EOF', };
const GREEK_KEYWORDS = {'ΑΛΓΟΡΙΘΜΟΣ': TokenType.ALGORITHM,'ΣΤΑΘΕΡΕΣ': TokenType.CONSTANTS,'ΔΕΔΟΜΕΝΑ': TokenType.DATA,'ΑΡΧΗ': TokenType.BEGIN,'ΤΕΛΟΣ': TokenType.END,'ΕΑΝ': TokenType.IF,'ΤΟΤΕ': TokenType.THEN,'ΑΛΛΙΩΣ': TokenType.ELSE,'ΓΙΑ': TokenType.FOR,'ΕΩΣ': TokenType.TO,'ΜΕ': TokenType.STEP,'ΒΗΜΑ': TokenType.STEP,'ΕΠΑΝΑΛΑΒΕ': TokenType.REPEAT,'ΕΝΟΣΩ': TokenType.WHILE,'ΜΕΧΡΙ': TokenType.UNTIL,'ΤΥΠΟΙ': TokenType.TYPES,'ΤΥΠΩΣΕ': TokenType.PRINT,'ΔΙΑΒΑΣΕ': TokenType.READ,'ΥΠΟΛΟΓΙΣΕ': TokenType.CALCULATE,'ΔΙΑΔΙΚΑΣΙΑ': TokenType.PROCEDURE,'ΔΙΑΔΙΚΑΣΙΑΣ': TokenType.PROCEDURE,'ΣΥΝΑΡΤΗΣΗ': TokenType.FUNCTION,'ΣΥΝΑΡΤΗΣΗΣ': TokenType.FUNCTION,'ΔΙΕΠΑΦΗ': TokenType.INTERFACE,'ΕΙΣΟΔΟΣ': TokenType.INPUT,'ΕΞΟΔΟΣ': TokenType.OUTPUT,'ΑΚΕΡΑΙΟΣ': TokenType.INTEGER_TYPE,'ΠΡΑΓΜΑΤΙΚΟΣ': TokenType.REAL_TYPE,'ΛΟΓΙΚΟΣ': TokenType.BOOLEAN_TYPE,'ΧΑΡΑΚΤΗΡΑΣ': TokenType.CHAR_TYPE,'ΣΥΜΒΟΛΟΣΕΙΡΑ': TokenType.STRING_TYPE,'ΚΑΙ': TokenType.AND,'Ή': TokenType.OR,'ΟΧΙ': TokenType.NOT,};
const ENGLISH_KEYWORDS = {'ARRAY': TokenType.ARRAY,'OF': TokenType.OF,'MOD': TokenType.MOD,'DIV': TokenType.DIV,'AND': TokenType.AND,'OR': TokenType.OR,'NOT': TokenType.NOT,'EOLN': TokenType.EOLN,'POINTER': TokenType.POINTER,'LIST': TokenType.LIST,'IF': TokenType.IF,'THEN': TokenType.THEN,'ELSE': TokenType.ELSE,'FOR': TokenType.FOR,'TO': TokenType.TO,'STEP': TokenType.STEP,'REPEAT': TokenType.REPEAT,'WHILE': TokenType.WHILE,'UNTIL': TokenType.UNTIL,'INTEGER': TokenType.INTEGER_TYPE,'REAL': TokenType.REAL_TYPE,'BOOLEAN': TokenType.BOOLEAN_TYPE,'CHAR': TokenType.CHAR_TYPE,'STRING': TokenType.STRING_TYPE};
const KEYWORDS = { ...GREEK_KEYWORDS, ...ENGLISH_KEYWORDS };
const OPERATORS = {':=': TokenType.ASSIGN,'+': TokenType.PLUS,'-': TokenType.MINUS,'*': TokenType.MULTIPLY,'/': TokenType.DIVIDE,'=': TokenType.EQUALS,'<': TokenType.LESS_THAN,'>': TokenType.GREATER_THAN,'<=': TokenType.LESS_EQUALS,'>=': TokenType.GREATER_EQUALS,'<>': TokenType.NOT_EQUALS,'(': TokenType.LEFT_PAREN,')': TokenType.RIGHT_PAREN,'[': TokenType.LEFT_BRACKET,']': TokenType.RIGHT_BRACKET,',': TokenType.COMMA,':': TokenType.COLON,';': TokenType.SEMICOLON,'.': TokenType.DOT,'^': TokenType.CARET, '%': TokenType.PERCENT};
function isLetter(char) { return (char >= '\u0386' && char <= '\u03ce') || (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z'); }
function isDigit(char) { return char >= '0' && char <= '9'; }
function tokenize(code) { let tokens = []; let current = 0; let line = 1; let column = 1; while (current < code.length) { let char = code[current]; if (/
|	|||/.test(char)) { if (char === '\n') { line++; column = 1; } else { column++; } current++; continue; } if (char === '/' && code[current + 1] === '/') { while (current < code.length && code[current] !== '\n') current++; continue; } if (char === '/' && code[current + 1] === '*') { current += 2; while (current < code.length && (code[current] !== '*' || code[current + 1] !== '/')) { if (code[current] === '\n') { line++; column = 1; } else { column++; } current++; } if(current < code.length) {current += 2; column += 2;} continue; } if (char === '"') { let value = ''; current++; while (current < code.length && code[current] !== '"') { value += code[current++]; } current++; tokens.push({ type: TokenType.STRING, value, line, column }); column += value.length + 2; continue; } if (isDigit(char)) { let value = ''; while (current < code.length && isDigit(code[current])) { value += code[current++]; } if (code[current] === '.' && isDigit(code[current + 1])) { value += code[current++]; while (current < code.length && isDigit(code[current])) { value += code[current++]; } } tokens.push({ type: TokenType.NUMBER, value: parseFloat(value), line, column }); column += value.length; continue; } let twoCharOp = code.substring(current, current + 2); if (OPERATORS[twoCharOp]) { tokens.push({ type: OPERATORS[twoCharOp], value: twoCharOp, line, column }); current += 2; column += 2; continue; } if (OPERATORS[char]) { tokens.push({ type: OPERATORS[char], value: char, line, column }); current++; column++; continue; } if (isLetter(char) || char === '_' || char === '-') { let value = ''; while (current < code.length && (isLetter(code[current]) || isDigit(code[current]) || code[current] === '_' || code[current] === '-')) { value += code[current++]; } const upperValue = KEYWORDS[value.toUpperCase()]; if (upperValue) { tokens.push({ type: upperValue, value: value.toUpperCase(), line, column }); } else { tokens.push({ type: TokenType.IDENTIFIER, value, line, column }); } column += value.length; continue; } throw new Error(`Unexpected character '${char}' at line ${line}, column ${column}`); } tokens.push({ type: TokenType.EOF, value: 'EOF', line, column }); return tokens; }

// -----------------------------------------------------------------------------
// PARSER
// -----------------------------------------------------------------------------

class Parser {
    constructor(tokens) { this.tokens = tokens; this.current = 0; }
    isAtEnd() { return this.peek().type === TokenType.EOF; }
    peek() { return this.tokens[this.current]; }
    previous() { return this.tokens[this.current - 1]; }
    advance() { if (!this.isAtEnd()) this.current++; return this.previous(); }
    consume(type, message) { if (this.check(type)) return this.advance(); const token = this.peek(); throw new Error(message || `Expected token of type ${type} but got ${token.type} ('${token.value}') at line ${token.line}, column ${token.column}`); }
    check(type) { if (this.isAtEnd()) return false; return this.peek().type === type; }
    match(...types) { for (const type of types) { if (this.check(type)) { this.advance(); return true; } } return false; }
    parse() { return this.parseProgram(); }
    
    parseProgram() {
        this.consume(TokenType.ALGORITHM, "A program must start with 'ΑΛΓΟΡΙΘΜΟΣ'.");
        const name = this.consume(TokenType.IDENTIFIER, "Expected algorithm name.").value;
        const declarations = this.parseDeclarations();
        
        while(this.check(TokenType.PROCEDURE) || this.check(TokenType.FUNCTION)) {
            if (this.match(TokenType.PROCEDURE)) {
                declarations.push(this.parseProcedureDeclaration());
            } else if (this.match(TokenType.FUNCTION)){
                declarations.push(this.parseFunctionDeclaration());
            }
        }
        
        this.consume(TokenType.BEGIN, "Expected 'ΑΡΧΗ' for the main program body.");
        const body = this.parseBlock();
        this.consume(TokenType.END, "A program must end with 'ΤΕΛΟΣ'.");
        return { type: 'Program', name, declarations, body };
    }

    parseProcedureDeclaration() {
        const name = this.consume(TokenType.IDENTIFIER, "Expected procedure name.").value;
        const params = [];
        if (this.match(TokenType.LEFT_PAREN)) {
            if (!this.check(TokenType.RIGHT_PAREN)) {
                do {
                    if (this.match(TokenType.PERCENT)) {
                        params.push({name: this.consume(TokenType.IDENTIFIER, "Expected parameter name.").value, passBy: 'reference'});
                    } else {
                        params.push({name: this.consume(TokenType.IDENTIFIER, "Expected parameter name.").value, passBy: 'value'});
                    }
                } while (this.match(TokenType.COMMA));
            }
            this.consume(TokenType.RIGHT_PAREN, "Expected ')' after procedure parameters.");
        }
        this.parseInterfaceBlock();
        const localDeclarations = this.parseDeclarations();
        this.consume(TokenType.BEGIN, `Expected 'ΑΡΧΗ' for procedure '${name}'.`);
        const body = this.parseBlock();
        const endToken = this.consume(TokenType.IDENTIFIER, `Expected 'ΤΕΛΟΣ-ΔΙΑΔΙΚΑΣΙΑΣ' for procedure '${name}'.`);
        if (!endToken.value.toUpperCase().startsWith('ΤΕΛΟΣ-ΔΙΑΔΙΚΑΣΙΑΣ')) {
            throw new Error(`Expected 'ΤΕΛΟΣ-ΔΙΑΔΙΚΑΣΙΑΣ' but got '${endToken.value}'`);
        }
        return { type: 'ProcedureDeclaration', name, params, declarations: localDeclarations, body };
    }

    parseFunctionDeclaration() {
        const name = this.consume(TokenType.IDENTIFIER, "Expected function name.").value;
        const params = [];
         if (this.match(TokenType.LEFT_PAREN)) {
            if (!this.check(TokenType.RIGHT_PAREN)) {
                do {
                    if (this.match(TokenType.PERCENT)) {
                        params.push({name: this.consume(TokenType.IDENTIFIER, "Expected parameter name.").value, passBy: 'reference'});
                    } else {
                        params.push({name: this.consume(TokenType.IDENTIFIER, "Expected parameter name.").value, passBy: 'value'});
                    }
                } while (this.match(TokenType.COMMA));
            }
            this.consume(TokenType.RIGHT_PAREN, "Expected ')' after function parameters.");
        }
        this.consume(TokenType.COLON, "Expected ':' for function return type.");
        const returnType = this.parseType();
        this.parseInterfaceBlock();
        const localDeclarations = this.parseDeclarations();
        this.consume(TokenType.BEGIN, `Expected 'ΑΡΧΗ' for function '${name}'.`);
        const body = this.parseBlock();
        const endToken = this.consume(TokenType.IDENTIFIER, `Expected 'ΤΕΛΟΣ-ΣΥΝΑΡΤΗΣΗΣ' for function '${name}'.`);
        if (!endToken.value.toUpperCase().startsWith('ΤΕΛΟΣ-ΣΥΝΑΡΤΗΣΗΣ')) {
             throw new Error(`Expected 'ΤΕΛΟΣ-ΣΥΝΑΡΤΗΣΗΣ' but got '${endToken.value}'`);
        }
        return { type: 'FunctionDeclaration', name, params, returnType, declarations: localDeclarations, body };
    }

    parseInterfaceBlock() {
        if (!this.match(TokenType.INTERFACE)) return;
        while(!this.check(TokenType.DATA) && !this.check(TokenType.BEGIN) && !this.isAtEnd()) {
            this.advance();
        }
    }

    parseDeclarations() { const declarations = []; while (true) { if (this.match(TokenType.CONSTANTS)) { declarations.push(...this.parseConstantDeclarations()); } else if (this.match(TokenType.TYPES)) { while(!this.check(TokenType.DATA) && !this.check(TokenType.BEGIN) && !this.isAtEnd() && !this.check(TokenType.PROCEDURE) && !this.check(TokenType.FUNCTION)) this.advance(); } else if (this.match(TokenType.DATA)) { declarations.push(...this.parseVariableDeclarations()); } else { break; } } return declarations; }
    parseConstantDeclarations() { const consts = []; while (this.check(TokenType.IDENTIFIER)) { const name = this.consume(TokenType.IDENTIFIER, "Expected constant name.").value;
        this.consume(TokenType.EQUALS, "Expected '=' after constant name.");
        const value = this.parseExpression();
        this.consume(TokenType.SEMICOLON, "Expected ';' after constant declaration.");
        consts.push({ type: 'ConstantDeclaration', name, value });
    } return consts; }
    parseVariableDeclarations() { const vars = []; while (this.check(TokenType.IDENTIFIER)) { const names = [this.consume(TokenType.IDENTIFIER, "Expected variable name.").value]; while(this.match(TokenType.COMMA)) { names.push(this.consume(TokenType.IDENTIFIER, "Expected variable name after comma.").value); }
        this.consume(TokenType.COLON, "Expected ':' after variable name(s).");
        const varType = this.parseType();
        this.consume(TokenType.SEMICOLON, "Expected ';' after variable declaration.");
        for(const name of names) { vars.push({ type: 'VariableDeclaration', name, varType }); }
    } return vars; }
    
    parseType() {
        if (this.match(TokenType.INTEGER_TYPE, TokenType.REAL_TYPE, TokenType.BOOLEAN_TYPE, TokenType.CHAR_TYPE, TokenType.STRING_TYPE)) {
            return { type: 'DataType', name: this.previous().type };
        }
        if (this.match(TokenType.ARRAY)) {
            const dimensions = [];
            this.consume(TokenType.LEFT_BRACKET, "Expected '[' after ARRAY.");
            do {
                const from = this.parseExpression();
                this.consume(TokenType.DOT, "Expected '..' range separator in array declaration.");
                this.consume(TokenType.DOT, "Expected '..' range separator in array declaration.");
                const to = this.parseExpression();
                dimensions.push({ from, to });
            } while (this.match(TokenType.COMMA));
            this.consume(TokenType.RIGHT_BRACKET, "Expected ']' after array dimensions.");
            this.consume(TokenType.OF, "Expected 'OF' after array declaration.");
            const ofType = this.parseType();
            return { type: 'ArrayType', dimensions, ofType };
        }
        throw new Error(`Unexpected token '${this.peek().value}' while parsing a type.`);
    }

    parseBlock() {
        const statements = [];
        while (true) {
            if (this.isAtEnd()) break;
            const token = this.peek();
            if (token.type === TokenType.END || token.type === TokenType.ELSE || token.type === TokenType.UNTIL) {
                break;
            }
            if (token.type === TokenType.IDENTIFIER) {
                const upperValue = token.value.toUpperCase();
                if (upperValue.startsWith('ΤΕΛΟΣ-') || upperValue === 'ΕΑΝ-ΤΕΛΟΣ' || upperValue === 'ΓΙΑ-ΤΕΛΟΣ' || upperValue === 'ΕΝΟΣΩ-ΤΕΛΟΣ') {
                    break;
                }
            }
            statements.push(this.parseStatement());
        }
        return statements.filter(s => s !== null);
    }
    
    parseStatement() {
        if (this.match(TokenType.CALCULATE)) { return this.parseProcedureCall(); }
        if (this.match(TokenType.PRINT)) { return this.parsePrintStatement(); }
        if (this.match(TokenType.IF)) { return this.parseIfStatement(); }
        if (this.match(TokenType.FOR)) { return this.parseForStatement(); }
        if (this.match(TokenType.WHILE)) { return this.parseWhileStatement(); }
        if (this.match(TokenType.REPEAT)) { return this.parseRepeatUntilStatement(); }
        if (this.match(TokenType.READ)) { return this.parseReadStatement(); }
        
        if (this.check(TokenType.IDENTIFIER)) {
            const nextToken = this.tokens[this.current + 1];
            if (nextToken && (nextToken.type === TokenType.ASSIGN || nextToken.type === TokenType.LEFT_BRACKET)) {
                return this.parseAssignmentStatement();
            }
            if (nextToken && nextToken.type === TokenType.LEFT_PAREN) {
                return this.parseProcedureCall();
            }
        }
        const token = this.peek();
        throw new Error(`Unexpected statement starting with '${token.value}' at line ${token.line}`);
    }

    parseProcedureCall() { const name = this.consume(TokenType.IDENTIFIER, "Expected procedure name.").value; this.consume(TokenType.LEFT_PAREN, "Expected '(' after procedure name."); const args = []; if (!this.check(TokenType.RIGHT_PAREN)) { do { if(this.match(TokenType.PERCENT)) { args.push({value: this.parseExpression(), passBy: 'reference'}); } else { args.push({value: this.parseExpression(), passBy: 'value'}); } } while (this.match(TokenType.COMMA)); } this.consume(TokenType.RIGHT_PAREN, "Expected ')' after procedure arguments."); this.match(TokenType.SEMICOLON); return { type: 'ProcedureCall', name, args }; }
    parseReadStatement() { this.consume(TokenType.LEFT_PAREN, "Expected '(' after ΔΙΑΒΑΣΕ."); const args = []; if (!this.check(TokenType.RIGHT_PAREN)) { do { args.push(this.parseExpression()); } while (this.match(TokenType.COMMA)); } this.consume(TokenType.RIGHT_PAREN, "Expected ')' after arguments."); this.match(TokenType.SEMICOLON); return { type: 'ReadStatement', args }; }
    parseIfStatement() { const condition = this.parseExpression(); this.consume(TokenType.THEN, "Expected 'ΤΟΤΕ' after IF condition."); const thenBranch = this.parseBlock(); let elseBranch = null; if (this.match(TokenType.ELSE)) { elseBranch = this.parseBlock(); } const endToken = this.consume(TokenType.IDENTIFIER, "Expected 'ΕΑΝ-ΤΕΛΟΣ' after IF statement."); if (!endToken.value.toUpperCase().startsWith('ΕΑΝ-ΤΕΛΟΣ')) { throw new Error(`Expected 'ΕΑΝ-ΤΕΛΟΣ' but got '${endToken.value}' at line ${endToken.line}`); } this.match(TokenType.SEMICOLON); return { type: 'IfStatement', condition, thenBranch, elseBranch }; }
    parseForStatement() { const variable = this.consume(TokenType.IDENTIFIER, "Expected loop variable for FOR loop.").value; this.consume(TokenType.ASSIGN, "Expected ':=' after loop variable."); const start = this.parseExpression(); this.consume(TokenType.TO, "Expected 'ΕΩΣ' in FOR loop."); const end = this.parseExpression(); let step = { type: 'Literal', value: 1 }; if (this.match(TokenType.STEP) || this.match(TokenType.IDENTIFIER, "ΜΕ")) { step = this.parseExpression(); } this.consume(TokenType.REPEAT, "Expected 'ΕΠΑΝΑΛΑΒΕ' in FOR loop."); const body = this.parseBlock(); const endToken = this.consume(TokenType.IDENTIFIER, "Expected 'ΓΙΑ-ΤΕΛΟΣ' after FOR loop body."); if (!endToken.value.toUpperCase().startsWith('ΓΙΑ-ΤΕΛΟΣ')) { throw new Error(`Expected 'ΓΙΑ-ΤΕΛΟΣ' but got '${endToken.value}' at line ${endToken.line}`); } this.match(TokenType.SEMICOLON); return { type: 'ForStatement', variable, start, end, step, body }; }
    parseWhileStatement() { const condition = this.parseExpression(); this.consume(TokenType.REPEAT, "Expected 'ΕΠΑΝΑΛΑΒΕ' in WHILE loop."); const body = this.parseBlock(); const endToken = this.consume(TokenType.IDENTIFIER, "Expected 'ΕΝΟΣΩ-ΤΕΛΟΣ' after WHILE loop body."); if (!endToken.value.toUpperCase().startsWith('ΕΝΟΣΩ-ΤΕΛΟΣ')) { throw new Error(`Expected 'ΕΝΟΣΩ-ΤΕΛΟΣ' but got '${endToken.value}' at line ${endToken.line}`); } this.match(TokenType.SEMICOLON); return { type: 'WhileStatement', condition, body }; }
    parseRepeatUntilStatement() { const body = this.parseBlock(); this.consume(TokenType.UNTIL, "Expected 'ΜΕΧΡΙ' after REPEAT loop body."); const condition = this.parseExpression(); this.match(TokenType.SEMICOLON); return { type: 'RepeatUntilStatement', condition, body }; }
    parsePrintStatement() { this.consume(TokenType.LEFT_PAREN, "Expected '(' after ΤΥΠΩΣΕ."); const expressions = []; if (!this.check(TokenType.RIGHT_PAREN)) { do { expressions.push(this.parseExpression()); } while (this.match(TokenType.COMMA)); } this.consume(TokenType.RIGHT_PAREN, "Expected ')' after expressions in ΤΥΠΩΣΕ."); this.match(TokenType.SEMICOLON); return { type: 'PrintStatement', expressions }; }
    
    parseAssignmentStatement() {
        const name = this.consume(TokenType.IDENTIFIER, "Expected identifier for assignment.").value;
        let indices = [];
        if (this.match(TokenType.LEFT_BRACKET)) {
            do {
                indices.push(this.parseExpression());
            } while (this.match(TokenType.COMMA));
            this.consume(TokenType.RIGHT_BRACKET, "Expected ']' after array index.");
        }
        this.consume(TokenType.ASSIGN, "Expected ':=' for assignment.");
        const value = this.parseExpression();
        this.match(TokenType.SEMICOLON);
        return { type: 'AssignmentStatement', identifier: name, indices, value };
    }

    parseExpression() { return this.parseLogicalOr(); }
    parseLogicalOr() { let left = this.parseLogicalAnd(); while (this.match(TokenType.OR)) { const operator = this.previous().value; const right = this.parseLogicalAnd(); left = { type: 'BinaryExpression', operator, left, right }; } return left; }
    parseLogicalAnd() { let left = this.parseEquality(); while (this.match(TokenType.AND)) { const operator = this.previous().value; const right = this.parseEquality(); left = { type: 'BinaryExpression', operator, left, right }; } return left; }
    parseEquality() { let left = this.parseComparison(); while (this.match(TokenType.EQUALS, TokenType.NOT_EQUALS)) { const operator = this.previous().value; const right = this.parseComparison(); left = { type: 'BinaryExpression', operator, left, right }; } return left; }
    parseComparison() { let left = this.parseArithmetic(); while (this.match(TokenType.GREATER_THAN, TokenType.GREATER_EQUALS, TokenType.LESS_THAN, TokenType.LESS_EQUALS)) { const operator = this.previous().value; const right = this.parseArithmetic(); left = { type: 'BinaryExpression', operator, left, right }; } return left; }
    parseArithmetic() { let left = this.parseTerm(); while (this.match(TokenType.PLUS, TokenType.MINUS)) { const operator = this.previous().value; const right = this.parseTerm(); left = { type: 'BinaryExpression', operator, left, right }; } return left; }
    parseTerm() { let left = this.parseFactor(); while (this.match(TokenType.MULTIPLY, TokenType.DIVIDE, TokenType.MOD, TokenType.DIV)) { const operator = this.previous().value; const right = this.parseFactor(); left = { type: 'BinaryExpression', operator, left, right }; } return left; }
    parseFactor() { if (this.match(TokenType.NOT)) { const operator = this.previous().value; const right = this.parseFactor(); return { type: 'UnaryExpression', operator, right }; }
        if (this.match(TokenType.MINUS, TokenType.PLUS)) { const operator = this.previous().value; const right = this.parseFactor(); return { type: 'UnaryExpression', operator, right }; }
        return this.parsePrimary();
    }
    
    parsePrimary() {
        if (this.match(TokenType.NUMBER, TokenType.STRING)) {
            return { type: 'Literal', value: this.previous().value };
        }
        if (this.match(TokenType.IDENTIFIER)) {
            const name = this.previous().value;
            if (name.toUpperCase() === 'TRUE') return { type: 'Literal', value: true };
            if (name.toUpperCase() === 'FALSE') return { type: 'Literal', value: false };
            if (this.check(TokenType.LEFT_PAREN)) {
                return this.parseFunctionCall(name); }
            if (this.check(TokenType.LEFT_BRACKET)) {
                this.consume(TokenType.LEFT_BRACKET);
                const indices = [];
                do { indices.push(this.parseExpression()); } while(this.match(TokenType.COMMA));
                this.consume(TokenType.RIGHT_BRACKET, "Expected ']' after array indices.");
                return { type: 'ArrayAccess', name, indices };
            }
            return { type: 'Identifier', name };
        }
        if (this.match(TokenType.EOLN)) { return { type: 'Identifier', name: 'EOLN' }; }
        if (this.match(TokenType.LEFT_PAREN)) { const expr = this.parseExpression(); this.consume(TokenType.RIGHT_PAREN, "Expected ')' after expression."); return { type: 'Grouping', expression: expr }; }
        const token = this.peek();
        throw new Error(`Unexpected token '${token.value}' when parsing primary expression at line ${token.line}`);
    }

    parseFunctionCall(name) { this.consume(TokenType.LEFT_PAREN, "Expected '(' for function call.");
        const args = [];
        if (!this.check(TokenType.RIGHT_PAREN)) {
            do { args.push(this.parseExpression()); } while (this.match(TokenType.COMMA));
        }
        this.consume(TokenType.RIGHT_PAREN, "Expected ')' after function arguments.");
        return { type: 'FunctionCall', name, args };
    }
}

// -----------------------------------------------------------------------------
// INTERPRETER (Placeholder)
// -----------------------------------------------------------------------------

class Interpreter {
    interpret(ast) {
        return { output: "Parser successful! Interpreter not yet implemented.", error: null };
    }
}

// -----------------------------------------------------------------------------
// UI AND EXECUTION
// -----------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    const codeEditor = document.getElementById('code-editor');
    const runButton = document.getElementById('run-button');
    const outputDisplay = document.getElementById('output-display');

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