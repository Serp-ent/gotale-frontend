# Opis Projektu

# TODO: aktualizacja opisu

## Wstęp

Projekt **GoTale** to innowacyjne rozwiązanie, które łączy miłośników przygód i gier miejskich w jednym interaktywnym systemie. Naszym celem jest stworzenie aplikacji umożliwiającej graczom odkrywanie świata poprzez wspólne tworzenie i przeżywanie interaktywnych książek przygodowych (gamebooków). Gracze mogą tworzyć zespoły, podejmować decyzje w grze, a ich działania będą wymagały fizycznego przemieszczania się po mieście przy użyciu GPS.

Projekt opiera się na nowoczesnych technologiach, takich jak **Next.js** do budowy aplikacji webowej (Kreator gier paragrafowych), **Spring Boot** wraz z **Javą** jako fundament backendu oraz **Flutter** do tworzenia aplikacji mobilnej. Dzięki współpracy członków zespołu, wszystkie elementy systemu są spójnie zintegrowane, zapewniając graczom wyjątkowe doświadczenia.

## Cel

Głównym celem projektu **GoTale** jest stworzenie skalowalnego i intuicyjnego systemu, który łączy zespoły graczy poprzez wspólne poznawanie historii i eksplorację miast. Dzięki gamebookom użytkownicy mogą tworzyć własne interaktywne opowieści oraz przeżywać przygotowane historie w drużynach. Gra łączy narrację z elementami fizycznej eksploracji terenu, co pozwala na unikalne doświadczenia, integrację oraz poznawanie lokalnych atrakcji poprzez wykorzystanie GPS.

Kreator Gier umożliwia tworzenie i edytowanie interaktywnych historii, określanie decyzji graczy, ich konsekwencji, a także miejsca ich przygód, które gracze muszą odwiedzić w trakcie rozgrywki. Aplikacja mobilna **GoTale** pozwala na odtwarzanie stworzonych historii w czasie rzeczywistym, umożliwiając zespołom podejmowanie indywidualnych decyzji oraz śledzenie postępów innych graczy oraz ich aktualną lokalizację w grze.

### Przykłady zastosowań

- Gry miejskie na różnego rodzaju wydarzeniach.
- Poznawanie atrakcji turystycznych i legend danego miasta.
- Narzędzie edukacyjne (np. historyczne opowieści interaktywne dla uczniów).
- Organizacja imprez integracyjnych czy escape roomów na świeżym powietrzu.

---

## Architektura

Projekt składa się z trzech głównych komponentów:

### 1. Aplikacja Mobilna

- umożliwia zespołom na uczestniczenie w rozgrywkach w oparciu o stworzone wcześniej gry paragrafowe.
- **Technologia**: Flutter

  **Główne funkcje**:

  - Dynamiczne podejmowanie decyzji w grze i ich wpływ na przebieg historii
  - Lokalizacja członku zespołu na mapie za pomocą GPS
  - Przeżywanie interaktywnych przygód w czasie rzeczywistym
  - Dołączanie do zespołów lub tworzenie nowych
  - Rejestracja i logowanie użytkowników

### 2. Aplikacja webowa (Kreator Gier Paragrafowych)

- Narzędzie umożliwiające użytkownikom tworzenie własnych interaktywnych książek przygodowych, które później można eksplorować za pomocą aplikacji mobilnej.
- **Technologia**: React z Next.js

  **Główne funkcje**:

  - **Tworzenie i edycja gamebooków**  
    Narratorzy mogą projektować nieliniowe historie, w których każda decyzja graczy prowadzi do różnych rezultatów. (Wymagane zalogowanie).
  - **Personalizacja historii**  
    Możliwość ustalania zasad gry, takich jak liczba graczy w drużynie, czas na wykonanie misji czy poziom trudności.
  - **Lokalizacja na mapie**  
    Twórcy opowieści mogą przypisywać zadania lub wydarzenia do konkretnych miejsc w mieście, które gracze muszą odwiedzić.
  - **Prosty i intuicyjny interfejs**  
    Przyjazny dla twórców o różnym poziomie doświadczenia.
  - **Integracja z backendem**  
    W pełni zsynchronizowana z API backendu, co umożliwia zapis i edycję historii w czasie rzeczywistym.

### 3. Backend

- trzon systemu, zarządzając danymi i logiką gry oraz zapewniając płynną integrację między aplikacjami mobilnymi i webowymi.
- **Technologia**: Java + Spring Boot + PostgreSQL

  **Główne funkcje**:

  - Obsługa API REST do zarządzania danymi książek przygodowych
  - Obsługa WebSocketów do zarządzania trybem dla wielu graczy
  - Bezpieczne uwierzytelnianie użytkowników przy użyciu JWT
  - Obsługa bazy danych relacyjnych (PostgreSQL) do przechowywania historii, decyzji i wyników graczy
  - Synchronizacja danych między zespołami i urządzeniami

---

## Podsumowanie

Projekt **GoTale** oferuje wyjątkowe połączenie kreatywnej narracji, eksploracji miejskiej i współpracy zespołowej. Jego innowacyjność polega na integracji nowoczesnych technologii z fizycznym światem graczy, co czyni każdą przygodę niepowtarzalną. Dzięki kreatorowi gier twórcy mogą w łatwy sposób projektować złożone historie, a aplikacja mobilna zapewnia graczom dynamiczne doświadczenia w terenie oraz poznawanie lokalnych miejsc i legend.
