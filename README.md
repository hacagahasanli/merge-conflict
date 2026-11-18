<div align="center">

# Merge Conflict

### Some conflicts can't be resolved in code.

**A studio of fast browser games for settling it with your coworkers.**<br>
Pick a game, send your rival a link, settle it. No installs, no accounts.

<img alt="Floor 42, the first Merge Conflict game: two developers shooting it out across an office at night" src="assets/floor42.gif" width="100%">

</div>

## Games

| Game | What it is | Status |
| --- | --- | --- |
| [**Floor 42**](https://github.com/hacagahasanli/floor-42) | Code review got personal. Two developers, one floor of guns, and the meeting table is your only cover. Two hits and you're out. | online 1v1 |
| [**Last Commit Standing**](https://github.com/hacagahasanli/last-commit-standing) | A battle royale for developers who never agree: ten of you parachute into the same countryside, the Deadline closes in, and only the last one standing gets to merge. | online, up to 10 |
| **Parking Lot** | Two company cars, one parking space, no insurance. | in the garage |

Every game lives in its own repo and on its own subdomain of `mergeconflict.gg`. This repo is the studio page that lists them.

## This site

Plain HTML and CSS, no build step. Open `index.html`, or serve the folder:

```bash
npx serve .
```

Deployed to Cloudflare Pages at `mergeconflict.gg`.

## Pitch a game

Have a conflict that deserves its own game? [Open an issue](https://github.com/hacagahasanli/merge-conflict/issues/new).
