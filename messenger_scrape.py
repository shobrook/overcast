from bs4 import BeautifulSoup
import urllib

def get_soup(url):
    raw_page = urllib.urlopen(url).read()
    soup = BeautifulSoup(raw_page, "html.parser")
    return soup

def get_text_url(id):
    url = 'http://www.messenger.com/t/'
    url = url + str(id)
    return url

def get_text():
	id = '100004087752800'
    #mess = {}
    txt = ''
    url = get_text_url(id)
    soup = get_soup(url)
    txt = soup.find_all("div", class_ = "qtab-" + str(id))
    #txt_name = 
    #mess[txt_name] = txt
    return txt

def main():
    mess = get_text()
	print(mess)