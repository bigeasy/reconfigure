## Tue May  5 19:19:19 CDT 2020

Noticing that I've used `EventEmitter` to report the error while
reconfigurations are returned from an `async` function.

Oddly, for the first time in my life, I saw this and trusted that I must have
given this a lot of thought, because it most certainly would have bothered me
when it first occured to me. We wouldn't want to use both a push and pull
interface, but we don't want there to be a configuration if there is an error.

Although, as I write this, the order of errors matters, so the return from
reconfigure should be a status, and then either the error or the configuration.
Perhaps that level of indirection bothered me.
