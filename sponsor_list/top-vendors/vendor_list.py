import csv

# Get list of vendors from csv file
def get_vendor_list():
    with open('top-vendors/vendor_list.csv', 'r') as f:
        reader = csv.reader(f)
        vendor_list = list(reader)
        vendor_list = set(name[1] for name in vendor_list if name[1] != 'Name')
    return vendor_list

def get_company_list():
    with open('default.csv', 'r') as f:
        reader = csv.reader(f)
        vendor_list = list(reader)
        vendor_list = set(name[0] for name in vendor_list if name[0] != 'Company Name')
    return vendor_list

def main():
    vendor_list = get_vendor_list()
    company_list = get_company_list()
    not_in_list = set()

    for x in vendor_list:
        if x not in company_list:
            not_in_list.add(x)

    for x in not_in_list:
        print(x)

    print(len(not_in_list))
  

main()