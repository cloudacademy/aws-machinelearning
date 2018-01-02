CREATE EXTERNAL TABLE `censusadult_data_good`(
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
  's3://cloudacademy-emr-spark-data/good.data'
TBLPROPERTIES (
  'classification'='csv',
  'skip.header.line.count'='1')