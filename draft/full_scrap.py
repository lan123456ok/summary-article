from bs4 import BeautifulSoup
import requests
import google.generativeai as genai
import time

GEMINI_API_KEY = "AIzaSyAOMuYzw4JmdmmuvCnA7fScpbC9ia89gJQ"
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')


def get_summary_by_ai(text):
    try:
        prompt = f"Tóm gọn nội dung chính của nội dung sau: {text}"
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"Error getting summary from AI: {e}")
        return None


def scrape_articles():
    url = "https://vnexpress.net/tin-tuc-24h"
    articles_data = []

    try:
        result = requests.get(url, timeout=10)
        result.raise_for_status()
        soup = BeautifulSoup(result.text, "html5lib")

        articles = soup.find_all("article", class_="thumb-left")

        for article in articles:
            if article.find('ins', class_='adsbyeclick') or article.find('script'):
                continue

            if article.find('h3', class_='title-news'):
                article_info = extract_article_info(article)
                if article_info:
                    articles_data.append(article_info)
                    time.sleep(1)

        return articles_data

    except requests.RequestException as e:
        print(f"Error fetching URL: {e}")
        return []
    except Exception as e:
        print(f"Unexpected error: {e}")
        return []


def extract_article_info(article):
    try:
        title = None
        link_url = None
        description = None
        image_url = None

        title_tag = article.find('h3', class_='title-news')
        if title_tag:
            title_tag_next = title_tag.find('a')
            title = title_tag.get_text(strip=True) if title_tag else None
            link_url = title_tag_next['href'] if title_tag_next else None


        location_tag = article.find('span', class_='location-stamp')
        location = location_tag.get_text(strip=True) if location_tag else None

        time_tag = article.find('span', class_='time-ego')
        datetime = time_tag['datetime'] if time_tag and 'datetime' in time_tag.attrs else None

        description_tag = article.find('p', class_='description')
        if description_tag:
            description_link = description_tag.find('a')
            description = description_link.get_text(strip=True) if description_link else None

        image_tag = article.find('div', class_='thumb_art')
        if image_tag:
            img = image_tag.find('img')
            image_url = img.get('data-src') or img.get('src') if img else None

        if not title or not link_url:
            print("Skipping article due to missing essential data")
            return None

        article_data = {
            'title': title,
            'link_url': link_url,
            'location': location,
            'datetime': datetime,
            'description': description,
            'image_url': image_url
        }

        article_content = get_article_content(link_url)
        if article_content:
            # summary = get_summary_by_ai(article_content['content'])
            summary = ''
            article_data['category'] = article_content['category']
            article_data['content'] = article_content['content']
            article_data['summary'] = summary

        return article_data

    except AttributeError as e:
        print(f"Error parsing article: {e}")
        return None

def get_article_content(article_url):
    try:
        result = requests.get(article_url, timeout=10)
        result.raise_for_status()
        article_soup = BeautifulSoup(result.text, 'html5lib')

        article = article_soup.find('article', class_="fck_detail")
        if article:
            paragraphs = article.find_all('p', class_="Normal")
            content = [p.get_text(strip=True) for p in paragraphs]
            full_text = ' '.join(content)

            ul = article_soup.find('ul', class_='breadcrumb')
            first_a = ul.find('a') if ul else None


            category = first_a.get_text(strip=True) if first_a else None

            return {
                'content': full_text,
                'category': category
            }
        else:
            return {
                'content': None,
                'category': None
            }

    except requests.RequestException as e:
        print(f"Error fetching article content: {e}")
        return None
    except Exception as e:
        print(f"Error parsing article content: {e}")
        return None

if __name__ == "__main__":
    articles = scrape_articles()

    for i, article in enumerate(articles, 1):
        print(f"\nArticle {i}:")
        print(f"Title: {article['title']}")
        print(f"Category: {article['category']}")
        print(f"URL: {article['link_url']}")
        print(f"Summary: {article['summary']}\n")
        print("-" * 80)