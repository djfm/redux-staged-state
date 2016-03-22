[![Build Status](https://travis-ci.org/djfm/redux-staged-state.svg?branch=master)](https://travis-ci.org/djfm/redux-staged-state)

# redux-staged-state

The goal of this library is to provide a convenient way to manage transient state in a redux application.

The idea is similar to that of [redux-form](https://github.com/erikras/redux-form), but it differs in that it does not focus on *forms*, but on *staged state*, that is, parts of the state the a user intends to change but has not committed yet. Staged state may appear in different forms.
