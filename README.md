# fullstack_course

# Praktické cvičení - Lekce 3
## Full-stack pro začátečníky

### Úkoly

1. Vytvořte nový projekt na GitHubu, pouze se souborem `README.md`.  
2. Pomocí **GitHub Flow** procesu vytvořte **pull request**, který:
   - Vytvoří nový adresář `playground` a v něm soubor `package.json`.
   - Doplňte do souboru `package.json` informace o autorovi, repository a odkaz na hlášení chyb.
   - Nainstalujte balíčky pro **ESLint verze 9** a použijte:
     - `@eslint/js` doporučené nastavení (**recommended**)
     - `@stylistic/eslint-plugin`
   - Přidejte **2 NPM scripty**:
     1. Spustí ESLint.
     2. Spustí ESLint s parametrem `--fix`.
   - Přidejte do adresáře `playground` soubor `index.js`, který vypíše do konzole aktuální datum pomocí:
     ```js
     new Date().toLocaleTimeString()
     ```
   - Výpis do JavaScriptové konzole se provádí pomocí metody [`console.log`](https://developer.mozilla.org/en-US/docs/Web/API/console/log_static).  
     - Např. výpis slova `Ahoj`:
       ```js
       console.log("Ahoj");
       ```
     - Výpis proměnné:
       ```js
       console.log(new Date().toLocaleTimeString());
       ```

3. Nastavte lektora ([https://github.com/ladariha](https://github.com/ladariha)) jako **assignee**. Lektor provede **code review** a případně PR zmerguje.
