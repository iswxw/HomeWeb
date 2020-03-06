### MySQlL的基本使用

#### （1）[MySQL 连接](https://m.php.cn/manual/view/33968.html)

` mysql -uroot -p123456` 或 `mysql -h 127.0.0.1 -u root -p`

#### （2）[MySQL数据库与表显示、创建和删除](https://m.php.cn/manual/view/33969.html)

- 数据库显示：**show databases;**

- 创建数据库：**create database 库名字;**

- 删除数据库：**drop database [IF EXISTS] 库名字;**

- 选中数据库：**use 库名;**

- 显示数据表：**show tables;**[需要先选中数据库]

- 显示表结构：**desc 表名; 或者 describe 表名;**

- 表创建：

  ```mysql
  CREATE TABLE `member` (
    `uid` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '用户ID',
    `nickname` char(16) NOT NULL DEFAULT '' COMMENT '昵称',
    `sex` tinyint(3) unsigned NOT NULL DEFAULT '0' COMMENT '性别',
    `birthday` date NOT NULL DEFAULT '0000-00-00' COMMENT '生日',
    `qq` char(10) NOT NULL DEFAULT '' COMMENT 'qq号',
    `score` mediumint(8) NOT NULL DEFAULT '0' COMMENT '用户积分',
    `login` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '登录次数',
    `reg_ip` bigint(20) NOT NULL DEFAULT '0' COMMENT '注册IP',
    `reg_time` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '注册时间',
    `last_login_ip` bigint(20) NOT NULL DEFAULT '0' COMMENT '最后登录IP',
    `last_login_time` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '最后登录时间',
    `status` tinyint(4) NOT NULL DEFAULT '0' COMMENT '会员状态',
    PRIMARY KEY (`uid`),
    KEY `status` (`status`)
  ) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='会员表';

  实例解释：
  1，如果你不想字段为 NULL 可以设置字段的属性为 NOT NULL， 在操作数据库时如果输入该字段的数据为NULL ，
  会报错。
  2，AUTO_INCREMENT定义列为自增的属性，一般用于主键，数值会自动加1。
  3，PRIMARY KEY关键字用于定义列为主键。 您可以使用多列来定义主键，列间以逗号分隔。
  4，ENGINE 设置存储引擎，CHARSET 设置编码。
  ```

- 表删除：**drop table 表名;**
####（3）[表复制备份及还原](https://m.php.cn/manual/view/33970.html)

- 复制表结构

  ```mysql
  1.1 含有主键等信息的完整表结构
    CREATE table 新表名 LIKE book;
  1.2 只有表结构，没有主键等信息
    create table 新表名 select * from books;
    或
    create table  新表名 as (select * from book);
    或
    create table 新表名 select * from books where 1=2;
  ```

- **将旧表中的数据灌入新表**

  ```mysql
  INSERT INTO 新表 SELECT * FROM 旧表；
  ```

- **输入创建表的DDL语句**

  ```mysql
  show create table 表名;
  ```

- **清空表数据**

  ```mysql
  truncate table 表名;
  ```

####(4) [数据库表中数据操作](https://m.php.cn/manual/view/33971.html)

```txt
创建表,查看表结构,查看表详细结构,修改表名,修改字段的数据类型,修改字段名,增加字段,删除字段,删除关联表
（1）删除表的外键约束
（2）删除没有被关联的普通表
（3）删除被其他表关联的父表
```

- 创建表

  ```mysql
  CREATE TABLE 表名 （属性名 数据类型 [完整性约束条件]，
  属性名 数据类型 [完整性约束条件]，
  属性名 数据类型 [完整性约束条件]）

  完整性约束：“完整性约束条件”是指指定某些字段的某些特殊约束条件。
  下面是完整性约束条件：
  1，PRIMARY KEY 标识该属性为该表的主键，可以唯一的标识对应的元组
  2，FOREIGN KEY 标识该属性为该表的外键，是与之联系的某表的主键
  3，NOT NULL 标识该属性不能为空
  4，UNIQUE 标识该属性的值是唯一的
  5，AUTO_INCREMENT 标识该属性的值自动增加
  6，DEFAULT 为该属性设置默认值
  ```

- 查看表结构

  ```mysql
  show create table 表名
  show create table 表名 \G
  注意：\G增强显示可查看性
  ```

##### 1，表操作

- 修改表名

  ```mysql
  alter table 旧表名 rename [to] 新表名；
  ```

- **修改字段的数据类型：**

  ```mysql
  alter table 表名 modify 属性名 数据类型；
  ```

- **修改字段名：**

  ```mysql
  alter table 表名 change 旧属性名 新属性名 新数据类型；
  注意：旧属性名参数指修改前的字段名，新属性名参数指修改后的字段名，如果不指定数据类型则数据类型不变。
  ```

- **增加字段：**

  ```mysql
  alter table 表名 add 属性名1 数据类型 [完整性约束条件] [first] after 属性名2；
  ```

- **删除字段：**

  ```mysql
  alter table 表名 drop 属性名；
  ```

#### (5) 修改表中指定数据

```mysql
UPDATE 表名称 SET 列名称 = 新值 WHERE 列名称 = 某值
```

#### (6) [查询表](https://m.php.cn/manual/view/33973.html)