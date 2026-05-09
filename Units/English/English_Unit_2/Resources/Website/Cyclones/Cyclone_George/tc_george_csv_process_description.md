# TC George chart-to-CSV conversion process

## Source used
The source was an image of a table titled:

**Appendix A. Best track summary for TC George, for the period 5 - 12 March 2007.**

The table contained time-based cyclone tracking data, including:
- Year, month, day, and hour (UTC)
- Position latitude and longitude
- Position accuracy
- Maximum 10-minute wind
- Maximum gust
- Central pressure
- Approximate radius of gales
- Approximate radius of storm force winds
- Approximate radius of hurricane-force winds
- Radius of maximum wind

A note at the bottom of the chart gave the conversion factors:
- **1 nm = 1.852 km**
- **1 knot = 1.852 km/h**

## What was done
I converted the chart into a structured CSV file by doing the following:

### 1. Read the table values from the chart
Each row of the table was transcribed into tabular form, preserving the original sequence from **5 March 2007 00 UTC** through **12 March 2007 06 UTC**.

### 2. Kept non-converted fields as they were
The following fields were preserved in their original numeric form because they were not expressed in nautical miles or knots:
- `Year`
- `Month`
- `Day`
- `Hour_UTC`
- `Position_Latitude_S`
- `Position_Longitude_E`
- `Central_Pressure_hPa`

### 3. Converted nautical-mile values into kilometres
All columns originally expressed in **nautical miles (nm)** were converted to **kilometres (km)** using:

```text
kilometres = nautical_miles × 1.852
```

This applied to:
- `Position Accuracy`
- `Approx. Radius gales`
- `Approx. Radius storm force`
- `Approx. Radius hurricane`
- `Radius Max Wind`

These became:
- `Position_Accuracy_km`
- `Approx_Radius_Gales_km`
- `Approx_Radius_Storm_Force_km`
- `Approx_Radius_Hurricane_km`
- `Radius_Max_Wind_km`

### 4. Converted knot values into km/h
All columns originally expressed in **knots** were converted to **km/h** using:

```text
km/h = knots × 1.852
```

This applied to:
- `Max wind 10min`
- `Max gust`

These became:
- `Max_Wind_10min_kmh`
- `Max_Gust_kmh`

### 5. Left blank cells blank
Some cells in the source chart were empty, especially in the wind-radius columns for certain time points. Those missing values were left blank in the CSV rather than being filled with guesses or zeros.

### 6. Standardised the column names for CSV use
To make the file easier to use in spreadsheets, scripts, and databases, the headings were normalised into consistent machine-friendly names:

```text
Year
Month
Day
Hour_UTC
Position_Latitude_S
Position_Longitude_E
Position_Accuracy_km
Max_Wind_10min_kmh
Max_Gust_kmh
Central_Pressure_hPa
Approx_Radius_Gales_km
Approx_Radius_Storm_Force_km
Approx_Radius_Hurricane_km
Radius_Max_Wind_km
```

## Resulting file
The final output was saved as:

`tc_george_best_track_2007_km.csv`

## Output summary
- **Rows:** 35
- **Columns:** 14
- **Time span covered:** 5 March 2007 00 UTC to 12 March 2007 06 UTC
- **Unit changes made:**
  - nautical miles → kilometres
  - knots → km/h
- **Pressure remained in:** hPa
- **Latitude/longitude remained in:** decimal degrees with south/east directional meaning implied by the column names

## Example of the conversion logic
Examples of the exact conversion approach used:

- `10 nm` → `18.52 km`
- `30 knots` → `55.56 km/h`
- `45 knots` → `83.34 km/h`
- `25 nm` → `46.30 km`

In the CSV, these values were stored in rounded decimal form suitable for spreadsheet use.

## Notes on accuracy
This process preserved the structure and values of the original chart as closely as possible while changing the measurement units. Blank entries in the original source were intentionally preserved as blank cells in the CSV.
