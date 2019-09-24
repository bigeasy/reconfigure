Generate the `bytes.txt`. The `watch` program will watch the current directory
do you can copy `bytes.txt` to new files in this directory and see the events
and `stat`s to determine the behavior on different operating systems. It is
actually interesting to watch the `bytes.txt` file get generated.

Please do not commit the `bytes.txt` to `git`. I added `*.txt` for this
directory to `.gitignore`, so you can use `*.txt` as a suffix when you copy the
bytes around.

Appears to work on Mac and Linux. If you're using something like Consul
templates and you want to be sure to load the flushed file, you might use `touch
bytes.txt` finally touch the file.

Reconfigure should expect failed compilations, not freak out terribly when they
happen. Trying to imagine a way to determine if a partial write is resolved by a
full write.

Actually, does seem like something we could do with a timer; after a bad read,
set a timer and warn if we get a bad configuration.

Ah, yes, that's the problem. Is the configuration bad because it has errors? Or
is it bad because our read was truncated waiting for a flush. We could log the
stat information and a checksum so that if we're debugging in a post-mortem, we
can load as many bytes of the file as are available and check the checksum. An
application could report a line count. Reconfigure could report a line count
that the user can choose to ignore if the file is binary.

Apparently, holding the file handle open doesn't change anything. The inode
doesn't change.

For Prolific, the only thing that makes sense at this point is to report the
SHA1 sum and time of the detected change. If the processor is static, then you
can verify the SHA1. If it is dynamically generated in some way, then you're
going to have to look at the start time. Perhaps we log the entire processor
source? That might make more sense.

We assume a copy, a write of a full file.

If we get a bad compile, we checksum what we have and note the length. If we get
a longer file with the same initial bytes, oh, heck, just keep the previous
buffer, and if we get longer buffer within the next second, don't report the
error. Don't report the error until we get a buffer that either doesn't start
with the buffer we have, or is shorter than the buffer we have. Report the last
failed compilation. This is how we implement tail.

When tailing changes are coming in 0 or 1 milliseconds. Sometimes as many as 12.
Waiting half a second to report an error would be enough. We could
definiatively, immediately report an error if the file restarts.
