Encrypted Messenger
======
![Screenshot](assets/heading.png)

**One-to-one secret conversations on Facebook messenger.**
An open source desktop app that combines the security of end-to-end encryption with Facebook messenger's ease of use. Simply login with Facebook and voila: convenient, secure, and reliable messaging. Built on electron and axolotl––an implementation of Open Whisper System's [forward secrecy protocol](https://whispersystems.org/docs/specifications/doubleratchet/doubleratchet.pdf).

## Download Encrypted Messenger
The project is still a 👶 and needs a little more time before going live. Be on the lookout for some first words.

## Your Data Matters
* Everybody has secrets. Protect them.
* While Facebook supports optional end-to-end encryption for the messenger app, they still hold your private keys. Take back your private keys.
* With overcast, you are in control. Facebook can't read your messages.
* Encrypted by default, overcast is the easiest way to avoid surveillance.

## Move With Us
**We're making secure communication easier.**
Clone the repository:
```$ git clone https://github.com/moonfruits/overcast.git```

Install the dependencies:
* [Axolotl](https://github.com/joebandenburg/libaxolotl-javascript)
* Electron binaries
* Mongodb (testing locally, for now)

To package and build overcast:
```npm install package.js```
(Once we actually have a package.js)

## The Road Ahead
Dual-functionality as a PGP keychain that uses FB authentication.
