---
title: PWS
order: 2
---

PWS is a homelabbing project that has taught me much about Linux, hardware, networking, and security practices. I use it to host a variety of self-created projects, open source software, and anything that piques my interest.

The v1 implementation of PWS was named Whitney, after the mountain in California. The original hardware was sourced from my old desktop PC, which was made completely of hand-me-down parts, and was housed in an old server case that was e-wasted by my college. This initial build was definitely on the "janky" side, featuring an unmounted power supply in the optical bay, secured only by some green yarn. (Fire hazard, anyone?)

Olomana, the web server, is a significant upgrade over its predecessor. I've built it as a 4U rack-mounted machine with modern components. It's now mounted in a 16U rack, with a UPS and mesh network node close by. Critical resources like RAM and CPU cores are now a little more abundant, and I've set up the ZFS filesystem to provide redundancy against the power outages that occasionally would corrupt drive on the original PWS.
I'm super happy with the rebuild, and would encourage anyone with similar interests to jump in and give homelabbing a try for themselves.

See more on [Github](https://github.com/runyanjake/olomana).

