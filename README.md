# Service Scheduling Mobile App

A React Native application built with Expo that allows users to browse service providers and book appointments.

## Features
- **Authentication:** Mock login/logout system using React Context.
- **Provider Discovery:** View providers by category with ratings.
- **Booking System:** Select available time slots for specific providers.
- **Management:** View and cancel upcoming appointments.

## Tech Stack
- **Framework:** React Native (Expo)
- **Navigation:** React Navigation (Stack)
- **State Management:** React Context API
- **UI:** Custom StyleSheet components

## How to Run
1. Install dependencies: `npm install`
2. Start the project: `npx expo start`
3. Scan the QR code with the **Expo Go** app on Android.

## Assumptions
- Data is currently mocked and stored in-memory (resets on app reload).
- Authentication is handled locally without a live backend for demonstration purposes.