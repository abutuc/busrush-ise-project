import click

from utils import load_path_raw, save_path_mock


@click.command()
@click.option('--raw', help='Name of the raw GPX file in subfolder raw/')
@click.option('--out', help='Name of the mock JSON file in subfolder mock/')
#
# Example: python3 dataparser.py --raw 20221109-092005.gpx --out AVRBUS-R0011-00.json
#
def main(raw, out):
    path = load_path_raw(raw)[::5]  # sample every 5th point
    save_path_mock(path, out)


if __name__ == '__main__':
    main()
