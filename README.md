# Projekt Zespołu 11 (2024/25)

> [!NOTE]
> Ten projekt jest forkiem projektu znajdującego się pod adresem: https://github.com/zesp11/zesp11.github.io

Aplikacja służy do tworzenia interaktywnych gier paragrafowych.

## Przegląd projektu

Strona projektu jest stworzona w **Next.js 16** z użyciem **TypeScript**, **React 19** oraz **Tailwind CSS 4**. Jest generowana statycznie, zawierająca opis projektu oraz harmonogram w plikach **Markdown**.

## Technologie

- **Next.js 16**
- **React 19**
- **Tailwind CSS 4**
- **TypeScript**
- **Markdown**

## Generowanie klienta API

W celu wygenerowania klienta API należy:

1. Pobrać schemat API (wymaga uruchomionego backendu):
   ```bash
   ./scripts/get-schema.sh
   ```
   **Uwaga:** Pobrany plik `backend-schema.yml` powinien zostać dodany do repozytorium git.

2. Wygenerować klienta na podstawie pobranego schematu:
   ```bash
   ./scripts/generate-api.sh
   ```

## Instalacja

```bash
npm install
```

## Uruchomienie aplikacji

```bash
npm run dev
```

## Deploy aplikacji

```bash
npm run build
npm run deploy
```
