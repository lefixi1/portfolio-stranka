-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: fligh
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `country`
--

DROP TABLE IF EXISTS `country`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `country` (
  `count_id` int NOT NULL AUTO_INCREMENT,
  `count_name` varchar(255) NOT NULL,
  `count_descr` varchar(1024) NOT NULL,
  `count_descr_long` varchar(2560) NOT NULL,
  `imageLocation` varchar(255) NOT NULL,
  PRIMARY KEY (`count_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `country`
--

LOCK TABLES `country` WRITE;
/*!40000 ALTER TABLE `country` DISABLE KEYS */;
INSERT INTO `country` VALUES (1,'Czech','Czech Republic, landlocked country located in central Europe. In 2016 the country adopted the name “Czechia” as a shortened, informal name for the Czech Republic.','The Czech Republic, located in the heart of Central Europe, is a country celebrated for its rich history, fairy-tale architecture, and cultural charm. Its capital, Prague, known as the “City of a Hundred Spires,” features stunning landmarks like Prague Castle, Charles Bridge, and the Astronomical Clock, reflecting a mix of Gothic, Baroque, and Renaissance styles. Beyond Prague, the country offers picturesque towns such as Český Krumlov and Kutná Hora, both UNESCO World Heritage sites, as well as spa towns like Karlovy Vary. The Czech countryside is dotted with castles, rolling hills, and forests, offering scenic beauty and outdoor activities. Famous for its beer culture, the Czech Republic produces some of the world\'s finest lagers, accompanied by hearty dishes like svíčková (marinated beef) and dumplings. With its vibrant culture, rich traditions, and stunning landscapes, the Czech Republic is a captivating destination where history and modern life blend seamlessly.','czech.jpg'),(2,'Finland','Finland is a Nordic welfare state that aims to be carbon neutral by 2035. It’s also the happiest country in the world. Around 75% of its surface is covered with forests, and it has the world’s biggest archipelago, as well as Europe’s largest lake district and last untamed wilderness, Lapland.','Finland, country located in northern Europe. Finland is one of the world’s most northern and geographically remote countries and is subject to a severe climate. Nearly two-thirds of Finland is blanketed by thick woodlands, making it the most densely forested country in Europe. Finland forms a symbolic northern border between western and eastern Europe: dense wilderness and Russia to the east, the Gulf of Bothnia and Sweden to the west.','finland.jpg'),(3,'France','France, country of northwestern Europe. Historically and culturally among the most important nations in the Western world.','France, located in Western Europe, is a country celebrated for its rich history, cultural elegance, and diverse landscapes. From the rolling vineyards of Bordeaux to the snow-capped Alps and the sun-drenched French Riviera, France’s geography is as stunning as it is varied. Iconic landmarks such as the Eiffel Tower in Paris, the Palace of Versailles, and the medieval Mont Saint-Michel reflect its storied past and architectural beauty. Renowned for its art and culture, France is home to world-famous museums like the Louvre and masterpieces by Monet, Renoir, and Rodin. French cuisine is legendary, featuring delicacies like croissants, coq au vin, and fine wines, while bustling cafés and vibrant markets capture the country’s charm. Paris, the capital, combines romance, fashion, and history, while cities like Lyon, Marseille, and Nice offer unique character and appeal. With its stunning scenery, rich traditions, and global influence in art, food, and fashion, France is a timeless and enchanting destination.','france.jpg'),(4,'Spain','Spain, country located in extreme southwestern Europe. It occupies about 85 percent of the Iberian Peninsula, which it shares with its smaller neighbour Portugal.','Spain, located in southwestern Europe, is a vibrant country known for its rich history, diverse culture, and stunning landscapes. From the sun-soaked beaches of the Mediterranean to the dramatic Pyrenees mountains, its geography is varied and beautiful. Spain’s cultural heritage shines through landmarks like the Alhambra in Granada and the Sagrada Familia in Barcelona, as well as its world-famous art, featuring masters like Picasso and Dalí. Renowned for its lively festivals such as La Tomatina and Flamenco performances, Spain also boasts exceptional cuisine, including paella and tapas. Dynamic cities like Madrid, Barcelona, and Seville offer a mix of history, modernity, and vibrant nightlife. With its warm climate, natural beauty, and passionate traditions, Spain is a destination full of life and charm.','spain.jpg'),(5,'Sweden','Sweden, country located on the Scandinavian Peninsula in northern Europe. Sweden occupies the greater part of the Scandinavian Peninsula, which it shares with Norway. The land slopes gently from the high mountains along the Norwegian frontier eastward to the Baltic Sea.','Sweden, located in Northern Europe on the Scandinavian Peninsula, is known for its stunning natural beauty, rich history, and modern design. The country’s landscape features vast forests, thousands of lakes, and a dramatic coastline dotted with islands, including the famous Stockholm Archipelago. In the north, the Arctic Circle offers the magical Northern Lights and midnight sun, while the south boasts fertile farmland and charming towns. Sweden’s cultural heritage combines Viking history with medieval landmarks like Visby’s city walls and modern architecture seen in cities like Stockholm, Gothenburg, and Malmö. The capital, Stockholm, is a blend of historic charm and contemporary style, with attractions like the Royal Palace and ABBA Museum. Famous for innovation, Sweden is a leader in design, sustainability, and technology. Swedish cuisine highlights simple, natural flavors with dishes like meatballs, gravad lax (cured salmon), and fika – the cherished coffee break tradition. With its serene landscapes, vibrant cities, and emphasis on quality of life, Sweden is a captivating blend of tradition and modern living.','sweden.jpg'),(6,'Switzerland','Switzerland, federated country of central Europe.A landlocked country of towering mountains, deep Alpine lakes, grassy valleys dotted with neat farms and small villages, and thriving cities that blend the old and the new, Switzerland is the nexus of the diverse physical and cultural geography of western Europe.','Switzerland is a mountainous country located in the heart of Europe, known for its four national languages: German, French, Italian, and Romansh. Politically neutral, it is home to numerous international organisations. The country offers a high standard of living, an efficient transport system, and a strong, innovative economy. While Switzerland is at the forefront of global innovation, it also places great importance on preserving its rich traditions.','switzerland.jpg'),(7,'Ukraine','Ukraine is a country in Eastern Europe. It is the second-largest European country. The capital is Kyiv, located on the Dnieper River in north-central Ukraine.','Ukraine, the largest country in Europe, is known for its rich history, vibrant culture, and diverse landscapes. From the golden domes of Kyiv’s St. Sophia Cathedral to the cobbled streets of Lviv, Ukraine boasts a blend of architectural beauty and historical significance. The capital, Kyiv, is a dynamic city with landmarks like the Pechersk Lavra monastery and Maidan Square, reflecting the country’s deep cultural heritage. Ukraine’s landscapes range from the Carpathian Mountains, perfect for hiking and skiing, to the Black Sea coast with its sunny beaches and port city of Odesa. The vast steppes and fertile farmland, known as Europe’s “breadbasket,” are central to Ukraine’s identity. Ukrainian culture thrives in its music, dance, and traditions, such as colorful embroidered vyshyvanka and hearty cuisine, including borsch (beet soup) and varenyky (dumplings). With its resilient spirit, natural beauty, and cultural richness, Ukraine is a land of history, hospitality, and deep traditions.','1cc90ad6-9f13-462b-ae5b-106e4cce5858-1746562694188.jpg');
/*!40000 ALTER TABLE `country` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-13 16:17:51
