# Cartoview Point in Polygon Analysis Tool
Point in Polygon Analysis Tool is a Cartoview app computes statistics for the distribution of a given attribute in a set of polygonal zones for point layer & save the result in a new geonode/geoserver layer
### How to use:
###### 1. Select a Point layer from the listed layers
###### 2. Select an attribute: based on the attribute selection the statistics will be generated
###### 3. Select a Polygon layer that bounds at least on point at the selected point layer
###### 4. Type the desired new layer name then press "Generate Layer" Button
&nbsp;
##### Then, If the layer is successfully created hit Layer Details to show results
- ###### The Output layer carries the same characteristic of the selected polygon layer
- ###### It has the same attributes in addition to the following attributes
    - ###### count: Represents the count of the selected point layer attribute in the polygon layer
    - ###### min: Represents the minimum value of the selected attribute in the polygon layer
    - ###### max: Represents the maximum value of the selected attribute in the polygon layer
    - ###### sum: Represents the sum value of the attributes values
    - ###### avg: Represents the average value of the attributes values
