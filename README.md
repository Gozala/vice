# vice #

This is VIM plugin for Ace. It can be added to the list of Ace plugins to add
a VIM modes and keybindings.

## Install ##

    npm install vice

## Usage ##

    teleport activate
    open http://localhost:4747/vice

## Develop ##

Easiest way to work on Vice is using `teleport` all you need to do in this case
is following (see wiki for more [details]):

    git clone git://github.com/Gozala/vice.git
    npm link vice

If you don't feel comfortable using teleport, you can also use symlinks or
git submodules / repos instead. All you need is to have is clones of following
repositories in `./support` directory:

- [ace](https://github.com/ajaxorg/ace)
- [pilot](https://github.com/ajaxorg/pilot)
- [cockpit](https://github.com/ajaxorg/cockpit)

[details]:https://github.com/ajaxorg/ace/wiki/Edit-or-embed-Ace-%28with-Teleport%29
