#!/usr/bin/tclsh
set comments $argv
puts [exec git add .]
puts [exec git commit -m "$comments"]
puts [exec git push heroku master]
