from flask import Flask, render_template, jsonify
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
import json

app = Flask(__name__)

COUNTRIES = [
    'Afghanistan', 'Albania', 'Algeria', 'Angola', 'Argentina', 'Armenia', 'Australia',
    'Austria', 'Azerbaijan', 'Brazil', 'Bulgaria', 'Cameroon', 'Chile', 'China', 'Colombia',
    'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Ecuador', 'Egypt, Arab Rep.', 'Eritrea',
    'Ethiopia', 'France', 'Germany', 'Ghana', 'Greece', 'India', 'Indonesia', 'Iran, Islamic Rep.',
    'Iraq', 'Ireland', 'Italy', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Lebanon', 'Malta',
    'Mexico', 'Morocco', 'Pakistan', 'Peru', 'Philippines', 'Russian Federation', 'Syrian Arab Republic',
    'Tunisia', 'Turkey', 'Ukraine'
]

@app.route("/")
def index():
    df = pd.read_csv("static/data/cleaned_filtered_agriRuralDevelopment.csv")
    
    # Get unique countries
    unique_countries = df["country_name"].unique()
    
    # Optional: get more info
    filtered_df = df[df["country_name"].isin(unique_countries)]

    # Send to template
    data = filtered_df.to_dict(orient="records")
    return render_template("index.html", data=json.dumps(data))

@app.route("/get_pca")
def get_pca():
    df = pd.read_csv("./static/data/cleaned_filtered_agriRuralDevelopment.csv")
    df.columns = df.columns.str.strip()

    # Filter by countries
    filtered_df = df[df['country_name'].isin(COUNTRIES)]

    # Most recent year (you can also hard-code 2020 if needed)
    most_recent_year = filtered_df['year'].max()
    df_recent = filtered_df[filtered_df['year'] == most_recent_year]

    # Drop non-numeric and non-feature columns
    features = df_recent.drop(columns=['country_name', 'country_code', 'year'])

    # Fill NA, then scale
    features_filled = features.fillna(0)  # or use dropna if you prefer
    scaled = StandardScaler().fit_transform(features_filled)

    # Run PCA
    pca = PCA(n_components=2)
    components = pca.fit_transform(scaled)

    results = []
    for i, (_, row) in enumerate(df_recent.iterrows()):
        results.append({
            'country': row['country_name'],
            'code': row['country_code'],
            'x': components[i][0],
            'y': components[i][1]
        })

    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)

