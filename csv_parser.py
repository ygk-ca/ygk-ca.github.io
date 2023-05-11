'''csv_parser.py - This file contains the functions required to parse the CSV file'''

import pandas as pd

def clean_numbers(x):
    '''
    This function cleans the formatting of the revenue numbers in the CSV file
    param: x - the number to clean
    return: x - the cleaned number
    '''
    if isinstance(x, str):
        x = x.replace("$", "").replace(",", "").replace(" ", "")
        return float(x)
    return x

def parseCSV(file: str):
    '''
    This function takes the CSV file and parses it by ascending revenue value
    param: file - the CSV file to parse
    return: df - the dataframe of the CSV file
    '''
    # fix any float formatting preemptively
    pd.options.display.float_format = '{:,.2f}'.format

    # read csv file
    df = pd.read_csv(file, dtype=str)

    # drop unnecessary columns
    df = df.drop(['Country', 'Province', 'Manufacturing Status', 'Import/Export Status', 'NAICS 2012 Code', 'NAICS 2012 Description', 'D&B Hoovers Industry', 'Ultimate Parent Country', 'Ultimate Parent Company', 'Parent Company', 'Parent Country', 'Ownership Type', 'Tradestyle', 'Entity Type', 'Employees (Single Site)', 'Employees (Blended Sites)', 'City'], axis=1)

    # convert string number representation to floats
    df['Revenue (USD)'] = df['Revenue (USD)'].apply(clean_numbers)

    # remove any companies we don't have revenue data for
    df = df.dropna(subset = ['Revenue (USD)'])

    # sort by revenue
    df = df.sort_values('Revenue (USD)', ascending=False)
    
    # return the dataframe
    return df

def main():
    '''This is the main function of the file where the execution happens'''

    # parse the CSV file
    df = parseCSV('data.csv')
    df.to_csv('top_revenue.csv', index=False)

main()