# /bin/bash
## needs imagemagick's convert and potrace vectorizer
for i in *.png
do
convert $i -colorspace gray -threshold 100% -flatten /tmp/tmp.pbm && potrace /tmp/tmp.pbm -s && convert -blur 9x.5 -edge 2 -negate /tmp/tmp.svg "${i%.*}"_edge.png
done