![untoken-cli: A token replacement CIL tool for text.](.github/banner.svg)

### Motivation

I have been looking for a simple CLI tool that replace tokens in a text given a set of values. The ability to _un-token_ a text.

## Usage

```sh
npx untoken source.txt target.txt --day=Monday --month=January
```

The above command will process the file `source.txt` and replace any occurrence of `{day}` and/or `{month}` with their respective values. The changes will be saved in `target.txt.

### Development

1.  Clone this repo.
2.  Install dependencies: `npm i`
3.  Profit!

### Tests

```sh
npm t
```

### Publishment

Every semver tag pushed to this repo will be published [via GitHub Actions](.github/workflows/publish.yml).

<div align=center>
<br>
<br>
<br>

Crafted by [Rubens Mariuzzo](https://github.com/rmariuzzo).<br>
[MIT license](LICENSE)

</div>
