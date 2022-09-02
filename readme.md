<!-- @format -->

# RainDrops - Mood-Lifter App

'RainDrops' is a lightweight photojournal web-app coupled with a slideshow gallery to help lift the mood of the user.

# How to use

**npm run start** to start app.
( Ensure postgresql service is running first! )

📷 - CAMERA MODE:

1.  Allows user takes a snap shot.
2.  User types in short journal entry based on the photo.
3.  User selects the emoticon describing the mood the user experienced based on what he/ she took a photo of. (currently this works off a desktop/laptop webcam, future plans for it to access the phone camera)

    Emotions:

    - 🥰❤ Like/ Love
    - 😇🙌 Feeling Grateful/Thankful
    - 😮🤯 Awe / Mind-Blown
    - 😀💡 Light Bulb moment
    - 💪🐱‍👓 Motivated / Inspired to continue

🎥 - GALLERY MODE:

1. User selects mood from descriptions in drop down lists.
2. Gallery with photos evoking opposite emotions to the mood selected starts to playback alongside song tracks with matching theme to help lift user's mood

# To Dos:

1. User Login
2. AI APIs for picking up comment sentiment and photo image recognition
3. Home button doesn't stop the carousel slideshow ( can set based on gallery state and emotion state)
