<h1 align="center">
  ORCA
</h1>

<div align="center">
  <p>OBS Remote Control Application for iOS and Android</p>
  <a href="https://github.com/2bdkid/ORCA/blob/master/LICENSE">
    <img src="https://img.shields.io/badge/License-GPLv3-blue.svg" alt="ORCA is released under the GPLv3 license." />
  </a>
</div>

# Features

ORCA currently supports

* Scene collection selection
* Scene selection
* Start/Stop streaming
* Changing of `obs-websocket` address/password

# Building

ORCA currently uses the [expo cli](https://docs.expo.io/workflow/expo-cli/).

## Expo (iOS/Android)

```
yarn install
expo start
```

## Android (Native/Emulator)

Requires Android Studio and environment set up per React Native's [documentation](https://reactnative.dev/docs/environment-setup).

```
yarn install
yarn android
```

# Usage

ORCA connects to [obs-websocket](https://github.com/Palakis/obs-websocket) running on OBS Studio instances. Set the address and password fields in the app.

# License

ORCA is released under the GPLv3, see [COPYING](https://github.com/2bdkid/ORCA/blob/main/COPYING).

ORCA incorporates MIT licensed code, see [LICENSE.MIT](https://github.com/2bdkid/ORCA/blob/main/LICENSE.MIT).