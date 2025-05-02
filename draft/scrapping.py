from bs4 import BeautifulSoup
import requests

# url = "https://vnexpress.net/cuu-tien-dao-nguyen-quang-hai-viet-nam-khong-chi-co-xuan-son-4831872.html"
url = "https://vnexpress.net/tin-tuc-24h"
result = requests.get(url)


soup = BeautifulSoup(result.text, "html5lib")

# article = soup.find('article', class_="fck_detail")
# paragraphs = article.find_all('p', class_="Normal")
#
# content = [p.get_text(strip=True) for p in paragraphs]
# full_text = ' '.join(content)
#
# category_tag = soup.find('a', {'data-medium': True})
#
# category = category_tag.get_text(strip=True) if category_tag else None
#
# print(f"Category: {category}")
# print(f"Content: {full_text}")

articles = soup.find_all("article", class_="thumb-left")
#
# articles_data = []
#
for i, article in enumerate(articles, 30):
    if article.find('ins', class_='adsbyeclick') or article.find('script'):
        continue

    if article.find('span', class_='time-ago'):
        print(f"\nArticle {i}:")
        print(f"Item: {article}")
        print("-" * 80)


#     title_tag = article.find('h3', class_='title-news')
#     if title_tag:
#         title_tag_next = title_tag.find('a')
#         title = title_tag.get_text(strip=True) if title_tag else None
#         link_url = title_tag_next['href']
#
#         # print(title, link_url)
#
#     location_tag = article.find('span', class_='location-stamp')
#     location = location_tag.get_text(strip=True) if location_tag else None
#
#     # print(location)
#
#     time_tag = article.find('span', class_='time-ago')
#     datetime = time_tag['datetime'] if time_tag and 'datetime' in time_tag.attrs else None
#
#     # print(datetime)
#
#     description_tag = article.find('p', class_='description')
#     if description_tag:
#         description_link = description_tag.find('a')
#         description = description_link.get_text(strip=True) if description_link else None
#
#         # print(description)
#
#     image_tag = article.find('div', class_='thumb-art')
#     if image_tag:
#         img = image_tag.find('img')
#         image_url = img.get('data-src') or img.get('src') if img else None
#
#         # print(image_url)
#
#     articles_data.append({
#         'title': title,
#         'link_url': link_url,
#         'location': location,
#         'datetime': datetime,
#         'description': description,
#         'image_url': image_url
#     })
#
# for article in articles_data:
#     print(f"Title: {article['title']}")
#     print(f"Link URL: {article['link_url']}")
#     print(f"Location: {article['location']}")
#     print(f"Datetime: {article['datetime']}")
#     print(f"Description: {article['description']}")
#     print(f"Image URL: {article['image_url']}\n")