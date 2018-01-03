CREATE EXTERNAL TABLE `adult_data_clean`(
  `age` bigint, 
  `workclass` string, 
  `education` string, 
  `relationship` string, 
  `occupation` string,
  `country` string,
  `income_cat` string
  
)
ROW FORMAT DELIMITED 
  FIELDS TERMINATED BY ',' 
STORED AS INPUTFORMAT 
  'org.apache.hadoop.mapred.TextInputFormat' 
OUTPUTFORMAT 
  'org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat'
LOCATION
  's3://cloudacademy-emr-spark-data/clean.data'
TBLPROPERTIES (
  'classification'='csv',
  'skip.header.line.count'='1')