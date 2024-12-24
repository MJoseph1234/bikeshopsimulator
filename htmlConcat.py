"""Concatenate HTML templates like an idiot
"""

__author__ = "Michael Joseph"
__copyright__ = "Copyright 2024, Michael Joseph"
__credits__ = ["Michael Joseph"]
__date__ = "2024-11-17"
__maintainer__ = "Michael Joseph"
__status__ = "Development"
__version__ = "0.1"

import argparse
import os

def main():
	# get the goal file from the cli
	# read the goal file to find dependency files
	# print every line of the goal file up to the first dependency file
	# print the contents of the dependency file
	# Print all of the next lines of the goal file up to the next dependency line
	# print the contents of the next dependency
	# etc.
	args = get_args()
	out = []
	with open(args.infile, 'r') as gf:
		for line in gf:
			out.append(line)
			if "/"*8 in line:
				contain_file = line.replace("/", "").strip()
				with open(args.input_directory + contain_file, 'r') as cf:
					for sub_line in cf:
						out.append(sub_line)

	if args.output_file is None:
		for line in out:
			print(line, end="")
		return

	with open(args.output_file, 'w') as outFile:
		for line in out:
			outFile.write(line)


def get_args():
	parser = argparse.ArgumentParser()
	parser.add_argument("infile",
		help = "source template file to read from")

	parser.add_argument("-id", "--input-directory",
		default = "./",
		help = "directory to search for sub-files")

	parser.add_argument("-o", "--output-file",
		help = "relative path and filename to write output",
		default = None)

	return(parser.parse_args())


if __name__ == '__main__':
	main()