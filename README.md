# znapi

`znapi` is a modern TS-first API library for
[zeronet-conservancy](https://github.com/zeronet-conservancy/zeronet-conservancy/),
compatible with earlier 0net incarnations. Currently work in progress.

It is essentially a modern take on ZeroFrame.js, however it isn't a
drop-in replacement. If you're building a new 0net site, it is
recommended to use this library (when it's ready).

## WIP

This is work in progress. Currently being used for in-house projects,
not yet suitable for production. However, if you're familiar with
0net, you may want to try it out and contribute.

## Features

- easy to use API
- promises
- dev mode (connect to local 0net node from your dev environment)
- compatibility with earlier versions
  (should return appropriate error when 0net version doesn't support certain API)

## License

Even though we generally prefer copyleft, this library is released under Apache 2.0
in order to avoid others building their own versions.
