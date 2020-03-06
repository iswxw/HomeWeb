### 1. MySql 版本

> - 5.x:
> - 5.0-5.1:早期产品的延续，升级维护
> - 5.4 - 5.x : MySQL 整合了三方公司的新存储引擎 （推荐 5.5）

#### （1）基本操作

> - 启动 mysql 应用： service mysql start
> - 关闭： service mysql stop
> - 重启： service mysql restart
>
> 注意：
>
> ```txt
> 在计算机reboot后 登陆MySQL :  mysql
> 	可能会报错：   "/var/lib/mysql/mysql.sock不存在"
> 	--原因：是Mysql服务没有启动
> 解决办法：
>     （1） 启动服务： 1.每次使用前 手动启动服务   /etc/init.d/mysql start
>     （2）开机自启   chkconfig mysql on     ,  chkconfig mysql off
>     （3）检查开机是否自动启动： ntsysv
> ```
>
> - 设置密码：给 mysql 的超级管理员 root 增加密码：/usr/bin/mysqladmin -u root password root
> - 登录：mysql -u root -p
>
> 数据库存放目录：
>
> ```txt
> ps -ef|grep mysql  可以看到：
> 		数据库目录：     datadir=/var/lib/mysql
> 		pid文件目录： --pid-file=/var/lib/mysql/bigdata01.pid
>
> 		MySQL核心目录：
> 			/var/lib/mysql :mysql 安装目录
> 			/usr/share/mysql:  配置文件
> 			/usr/bin：命令目录（mysqladmin、mysqldump等）
> 			/etc/init.d/mysql启停脚本
> MySQL配置文件
>       my-huge.cnf	高端服务器  1-2G内存
>       my-large.cnf   中等规模
>       my-medium.cnf  一般
>       my-small.cnf   较小
>       但是，以上配置文件mysql默认不能识别，默认只能识别 /etc/my.cnf
>       采用 my-huge.cnf ：
>       cp /usr/share/mysql/my-huge.cnf /etc/my.cnf
>       注意：mysql5.5默认配置文件/etc/my.cnf；Mysql5.6 默认配置文件/etc/mysql-default.cnf
> ```

#### （2）mysql 字符编码

> ```mysql
> sql  :  show variables like '%char%' ;
> 		可以发现部分编码是 latin,需要统一设置为utf-8
> 		设置编码：
> 		vi /etc/my.cnf:
> 		[mysql]
> 		default-character-set=utf8
> 		[client]
> 		default-character-set=utf8
>
> 		[mysqld]
> 		character_set_server=utf8
> 		character_set_client=utf8
> 		collation_server=utf8_general_ci
>
> 	重启Mysql:  service mysql restart
> 		sql  :  show variables like '%char%' ;
> 注意事项：修改编码 只对“之后”创建的数据库生效，因此 我们建议 在mysql安装完毕后，第一时间 统一编码。
> ```
>
> 小提示：mysql:清屏 ctrl+L , system clear

### 2. mysql 原理

> （1）MYSQL 逻辑分层 ：连接层 服务层 引擎层 存储层
>
> - InnoDB(默认) ：事务优先 （适合高并发操作；行锁）
> - MyISAM ：性能优先 （表锁）
>
> （2）引擎
>
> - 查询数据库引擎： 支持哪些引擎？ show engines ;
> - 查看当前使用的引擎 show variables like '%storage_engine%' ;
>
> （3）创建表的时候指定引擎和默认字符编码
>
> ```mysql
> create table tb(
> 		id int(4) auto_increment ,
> 		name varchar(5),
> 		dept varchar(5) ,
> 		primary key(id)
> 	)ENGINE=MyISAM AUTO_INCREMENT=1
> 	 DEFAULT CHARSET=utf8   ;
> ```

### 3. SQL 优化

​ **优化原因：**

​ 性能低、执行时间太长、等待时间太长、SQL 语句欠佳（连接查询）、索引失效、服务器参数设置不合理（缓冲、线程数）

#### （1）SQL 语句

> - 编写过程
>
> ```mysql
> select dinstinct  ..from  ..join ..on ..where ..group by ...having ..order by ..limit ..
> ```
>
> - 解析过程
>
> ```mysql
> from .. on.. join ..where ..group by ....having ...select dinstinct ..order by limit ...
> ```

#### （2）SQL 优化本质

​ **SQL 优化主要是在优化索引**

> - 索引（比喻）：相当于书的目录
>
> - 索引（概述）：
>
>   index 索引是帮助 mysql 高效获取数据的数据结构。索引的数据结构（树：B 树(默认)、Hash 树...）
>
> 举例：
>
> （1）B 树索引：
>
> （2）索引的原理
>
> - 索引的弊端：
>
>   1.索引本身很大， 可以存放在内存/硬盘（通常为 硬盘） 2.索引不是所有情况均适用： a.少量数据 b.频繁更新的字段 c.很少使用的字段 3.索引会降低增删改的效率（增删改 查）
>
> - 索引的优势：
>
>   1.提高查询效率（降低 IO 使用率）
>
>   2.降低 CPU 使用率 （...order by age desc,因为 B 树索引 本身就是一个 好排序的结构，因此在排序时 可以直接使用）
>
> MySQL 执行流程推荐：
>
> [MySQL 总体架构--->查询执行流程--->语句执行顺序](https://www.cnblogs.com/annsshadow/p/5037667.html)

### 4. 索引

#### （1）分类

> - 主键索引：不能重复 Id、不是 null
> - 唯一索引：不能重复 Id、可以是 null
> - 单值索引：单列 age、一个表可以多个单值索引,name。
> - 复合索引：多个列构成的索引 （相当于 二级目录 ： z: zhao） (name,age) (a,b,c,d,...,n)

#### （2）创建索引

> - **方式一**
>
> `create 索引类型 索引名 on 表(字段)`
>
> - 下面索引举例参照上面的 tb 表如下：
>
> a. 单值索引
>
> `create index dept_index on tb(dept);`
>
> b. 唯一索引
>
> `create unique index name_index on tb(name)`
>
> c. 复合索引
>
> `create index dept_name_index on tb(dept,name)`
>
> - **方式二**
>
> alter table 表名 索引类型 索引名（字段）
>
> a. 单值索引
>
> `alter table tb add index dept_index(dept);`
>
> b. 唯一索引
>
> `alter table tb add unique index name_index(name)`
>
> c. 复合索引
>
> `alter table tb add index dept_name_index(dept,name);`
>
> **注意：**如果一个字段是 primary key,则改动字段默认就是 主键索引

#### （2）删除索引

> ```mysql
> drop index 索引名 on 表名 ;
> drop index name_index on tb ;
> ```

#### （3）查询索引

> ```mysql
> show index from 表名 ;
> show index from 表名 \G
> ```
>
> **注意：**
>
> - 只有 DML(数据库管理语言),数据库的增删改需要 commit
> - 而 DDL 数据库定义语言，不需要 commit,他会自动提交

### 5. SQL 性能问题

#### （1）瓶颈：

> a. 分析 SQL 的执行计划：**explain**,可以模拟 SQL 优化器执行 SQL 语句，从而让开发人员 知道自己编写的 SQL 状况
>
> b. MySQL 查询优化其会干扰我们的优化
>
> **优化方法:**官网：https://dev.mysql.com/doc/refman/5.5/en/optimization.html

#### （2）查询执行计划

> - explain +SQL 语句
>
> `explain select * from tb;`
>
> - **explain 各个字段的意义描述**
>
> ```mysql
> id : 编号
> select_type ：查询类型
> table ：表
> type   ：类型
> possible_keys ：预测用到的索引
> key  ：实际使用的索引
> key_len ：实际使用索引的长度
> ref  :表之间的引用
> rows ：通过索引查询到的数据量
> Extra     :额外的信息
> ```
>
> （1）准备数据
>
> SQL 语句：
>
> ```mysql
> create table course
> (
> cid int(3),
> cname varchar(20),
> tid int(3)
> );
> create table teacher
> (
> tid int(3),
> tname varchar(20),
> tcid int(3)
> );
>
> create table teacherCard
> (
> tcid int(3),
> tcdesc varchar(200)
> );
> ```
>
> 插入数据：
>
> ```mysql
> insert into course values(1,'java',1);
> insert into course values(2,'html',1);
> insert into course values(3,'sql',2);
> insert into course values(4,'web',3);
>
> insert into teacher values(1,'tz',1);
> insert into teacher values(2,'tw',2);
> insert into teacher values(3,'tl',3);
>
> insert into teacherCard values(1,'tzdesc') ;
> insert into teacherCard values(2,'twdesc') ;
> insert into teacherCard values(3,'tldesc') ;
> ```

#### （3）ID 字段

> - 查询课程编号为 2 或 教师证编号为 3 的老师信息
> - explain +sql:
>
> 1. id: id 值相同，从上往下 顺序执行。\
>
>    ​ t3-tc3-c4
>
>    ​ tc3--c4-t6
>
> 2. 表的执行顺序 因数量的个数改变而改变的原因： 笛卡儿积
>
>    ```pascal
>        a 	 b    c
>    	4	3	 2   =  	 2*3=6 * 4   =24
>    						3*4=12* 2   =24
>    ```
>
>    **分析**
>
>    （1）当 id 相同时，数据小的表 优先查询；（因为查询是借助内存，当然内存放的数据越小越好）
>
>    （2）当 id 值不同：id 值越大越优先查询 (本质：在嵌套子查询时，先查内层 再查外层)
>
> - 查询教授 SQL 课程的老师的描述（desc）
>
>   ```mysql
>   explain select tc.tcdesc from teacherCard tc,course c,teacher t where c.tid = t.tid
>   and t.tcid = tc.tcid and c.cname = 'sql' ;
>   ```
>
> - 将以上 多表查询 转为子查询形式：
>
>   ```mysql
>   explain select tc.tcdesc from teacherCard tc where tc.tcid =
>   (select t.tcid from teacher t where  t.tid =
>   	(select c.tid from course c where c.cname = 'sql')
>   );
>   ```
>
> - 子查询+多表：
>
>   ```mysql
>   explain select t.tname ,tc.tcdesc from teacher t,teacherCard tc where t.tcid= tc.tcid
>   and t.tid = (select c.tid from course c where cname = 'sql') ;
>   ```
>
> （3）id 值有相同，又有不同： id 值越大越优先；id 值相同，从上往下 顺序执行

#### （4）select_type:查询类型

> - primary:包含子查询 SQL 中的 主查询 （最外层）
> - subquery：包含子查询 SQL 中的 子查询 （非最外层）
> - simple:简单查询（不包含子查询、union）
> - derived:衍生查询(使用到了临时表)
>
> （1）方式一：a.在 from 子查询中只有一张表
>
> ```mysql
> explain select  cr.cname 	from ( select * from course where tid in (1,2) ) cr ;
> ```
>
> （2）b.在 from 子查询中， 如果有 table1 union table2 ，则 table1 就是 derived,table2 就是 union
>
> ```mysql
> explain select  cr.cname 	from ( select * from course where tid = 1  union select * from course where tid = 2 ) cr ;
> ```
>
> **知识补充**
>
> - 主要用于连接查询，联合两个数据表，把两个表中所有的字段合成一张大表。
>
> - UNION 指令的目的：将两个 SQL 的结果集合并起来，从这个角度看，union 跟 join 有些类似，因为这两个指令都可以由多个表中截取资料
>
> - UNION 的一个限制是两个 SQL 语句所产生的栏位需要是同样的资料种类。另外，当我们用 UNION 这个指令时，我们只会看到不同的资料值 (类似 select distinct)。
>
> ```mysql
> UNION 的语法如下：
> 	[SQL 语句 1]
> 	UNION
> 	[SQL 语句 2]
> ```
>
> - union:上例
>
> - union result :告知开发人员，那些表之间存在 union 查询

#### （5）type:索引类型

       ```mysql

system > const > eq_ref > ref > fulltext > ref_or_null > index_merge > unique_subquery > index_subquery > range > index > ALL
```

- 优化一般级别：

  ```mysql
  system>const>eq_ref>ref>range>index>all   ，要对type进行优化的前提：有索引

  其中：system,const只是理想情况；实际能达到 ref>range
  ```

- system（忽略）: 只有一条数据的系统表 ；或 衍生表只有一条数据的主查询

  ```mysql
  create table test01
  (
  	tid int(3),
  	tname varchar(20)
  );

  insert into test01 values(1,'a') ;
  commit;
  ```

- (1) 增加索引

  ```mysql
  alter table test01 add constraint tid_pk primary key(tid) ;
  explain select * from (select * from test01 )t where tid =1 ;
  ```

- const：仅仅能查到一条数据的 SQL ,用于 Primary key 或 unique 索引 （类型 与索引类型有关）

  ```mysql
  explain select tid from test01 where tid =1 ;
  alter table test01 drop primary key ;
  create index test01_index on test01(tid) ;
  ```

- eq_ref:唯一性索引：对于每个索引键的查询，返回匹配唯一行数据（有且只有 1 个，不能多 、不能 0）

  ```mysql
  select ... from ..where name = ... .常见于唯一索引 和主键索引。

  alter table teacherCard add constraint pk_tcid primary key(tcid);
  alter table teacher add constraint uk_tcid unique index(tcid) ;

  explain select t.tcid from teacher t,teacherCard tc where t.tcid = tc.tcid ;
  ```

  **注意**

  以上 SQL，用到的索引是 t.tcid,即 teacher 表中的 tcid 字段；
  如果 teacher 表的数据个数 和 连接查询的数据个数一致（都是 3 条数据），则有可能满足 eq_ref 级别；否则无法满足。

  ​

- ref：非唯一性索引，对于每个索引键的查询，返回匹配的所有行（0，多）

  ```mysql
  准备数据：
   insert into teacher values(4,'tz',4) ;
   insert into teacherCard values(4,'tz222');

  测试：
  alter table teacher add index index_name (tname) ;
  explain select * from teacher 	where tname = 'tz';
  ```

- range：检索指定范围的行 ,where 后面是一个范围查询(between ,> < >=, 特殊:in 有时候会失效 ，

  从而转为 无索引 all)

  ```mysql
  alter table teacher add index tid_index (tid) ;
  explain select t.* from teacher t where t.tid in (1,2) ;
  explain select t.* from teacher t where t.tid <3 ;
  ```

- index：查询全部索引中数据

  `explain select tid from teacher ; --tid 是索引， 只需要扫描索引表，不需要所有表中的所有数据`

- all：查询全部表中的数据

  `explain select cid from course ; --cid不是索引，需要全表所有，即需要所有表中的所有数据`

**对于 explain 的字段类型小结：：**

- system/const: 结果只有一条数据
- eq_ref:结果多条；但是每条数据是唯一的 ；
- ref：结果多条；但是每条数据是是 0 或多条 ；

#### （6）possible_keys 主键

> 可能用到的索引，是一种预测，不准。

```mysql
alter table  course add index cname_index (cname);

explain select t.tname ,tc.tcdesc from teacher t,teacherCard tc
 where t.tcid= tc.tcid
and t.tid = (select c.tid from course c where cname = 'sql') ;
```

> 1. 如果 possible_key/key 是 NULL，则说明没用索引
>
>    ```mysql
>    explain select tc.tcdesc from teacherCard tc,course c,teacher t where c.tid = t.tid
>    and t.tcid = tc.tcid and c.cname = 'sql' ;
>    ```

#### （7）key

> 实际使用到的索引

#### （8）key_len ：索引的长度

> 作用：用于判断复合索引是否被完全使用 （a,b,c）。
>
> ```mysql
> create table test_kl
> (
> 	name char(20) not null default ''
> );
> alter table test_kl add index index_name(name) ;
> explain select * from test_kl where name ='' ;   -- key_len :60
> 在utf8：1个字符站3个字节
>
> alter table test_kl add column name1 char(20) ;  --name1可以为null
>
> alter table test_kl add index index_name1(name1) ;
> explain select * from test_kl where name1 ='' ;
> --如果索引字段可以为Null,则会使用1个字节用于标识。
>
> drop index index_name on test_kl ;
> drop index index_name1 on test_kl ;
>
> 增加一个复合索引
> alter table test_kl add index name_name1_index (name,name1) ;
>
> explain select * from test_kl where name1 = '' ; --121
> explain select * from test_kl where name = '' ; --60
>
>
> varchar(20)
> alter table test_kl add column name2 varchar(20) ; --可以为Null
> alter table test_kl add index name2_index (name2) ;
>
> explain select * from test_kl where name2 = '' ;  --63  （数据的总字节数，即长度）
> 20*3=60 +  1(null)  +2(用2个字节 标识可变长度)  =63
> ```
>
> **注意：**
>
> - mysql 表示 varchar 可变长度为 2 个字节 null 标识 1 个字节 得到最终长度
> - utf8:1 个字符 3 个字节
> - gbk:1 个字符 2 个字节
> - latin:1 个字符 1 个字节

#### （9）ref

> ref : 注意与 type 中的 ref 值区分。
> 作用： 指明当前表所 参照的 字段。
>
> `select ....where a.c = b.x ;(其中b.x可以是常量，const)`
>
> ```mysql
> alter table course  add index tid_index (tid) ;
>
> explain select * from course c,teacher t where c.tid = t.tid  and t.tname ='tw' ;
> ```

#### （10）rows

> 被索引优化查询的 数据个数 (实际通过索引而查询到的 数据个数)
>
> `explain select * from course c,teacher t where c.tid = t.tid and t.tname = 'tz' ;`

#### （11）Extra

> 1. (i).using filesort ： 性能消耗大；需要“额外”的一次排序（查询） 。常见于 order by 语句中。
>    排序：先查询
>
>    场景：10 个人 根据年龄排序。
>
>    ```mysql
>    create table test02
>    (
>    	a1 char(3),
>    	a2 char(3),
>    	a3 char(3),
>    	index idx_a1(a1),
>    	index idx_a2(a2),
>    	index idx_a3(a3)
>    );
>
>    explain select * from test02 where a1 ='' order by a1 ;
>
>    a1:姓名  a2：年龄
>    explain select * from test02 where a1 ='' order by a2 ; --using filesort
>    ```
>
>    **小结：**
>
>    - 对于单索引， 如果排序和查找是同一个字段，则不会出现 using filesort；如果排序和查找不是同一个字段，则会出现 using
>
>    - filesort；
>      避免： where 哪些字段，就 order by 那些字段 2
>
>    - 复合索引：不能跨列（最佳左前缀）
>
>      ```mysql
>      drop index idx_a1 on test02;
>      drop index idx_a2 on test02;
>      drop index idx_a3 on test02;
>      ```
>
>
>      alter table test02 add index idx_a1_a2_a3 (a1,a2,a3) ;
>      explain select *from test02 where a1='' order by a3 ;  --using filesort
>      explain select *from test02 where a2='' order by a3 ; --using filesort
>      explain select *from test02 where a1='' order by a2 ;
>      explain select *from test02 where a2='' order by a1 ; --using filesort
>      ```
>
> **理解：**（a1,a2,a3） [a1,a2]不夸列 跨列：[a1,a3] || [a2,a3] 都属于跨列
>
> **小结**：避免： where 和 order by 按照复合索引的顺序使用，不要跨列或无序使用。（我的理解：查什么就用什么排序）
>
> 2. using temporary:性能损耗大 ，用到了临时表。一般出现在 group by 语句中
>
>    ```mysql
>    explain select a1 from test02 where a1 in ('1','2','3') group by a1 ;
>    explain select a1 from test02 where a1 in ('1','2','3') group by a2 ; --using temporary
>    避免：查询那些列，就根据那些列 group by .（我的理解：查什么就用什么分组）
>    ```
>
> 3. using index :性能提升; 索引覆盖（覆盖索引）。原因：不读取原文件，只从索引文件中获取数据 （不需要回表查询）只要使用到的列 全部都在索引中，就是索引覆盖 using index
>
>    举例：test02 表中有一个复合索引(a1,a2,a3)
>
>    ```mysql
>    explain select a1,a2 from test02 where a1='' or a2= '' ; --using index
>    drop index idx_a1_a2_a3 on test02;
>
>    alter table test02 add index idx_a1_a2(a1,a2) ;
>    explain select a1,a3 from test02 where a1='' or a3= '' ;
>    ```
>
>    - 如果用到了索引覆盖(using index 时)，会对 possible_keys 和 key 造成影响：
>
>      a.如果没有 where，则索引只出现在 key 中；
>
>      b.如果有 where，则索引 出现在 key 和 possible_keys 中。
>
>      ```mysql
>      explain select a1,a2 from test02 where a1='' or a2= '' ;
>      explain select a1,a2 from test02  ;
>      ```
>
> 4. using where （需要回表查询）
>
>    假设 age 是索引列
>    但查询语句 select age,name from ...where age =...,此语句中必须回原表查 Name，因此会显示 using where.
>
>    ```mysql
>    explain select a1,a3 from test02 where a3 = '' ; --a3需要回原表查询
>
>    我的理解：先去索引中查，如果需要查索引中没有的字段则必须回表查询，即所谓的回表查询。
>    ```
>
> 5. impossible where ： where 子句永远为 false
>
> `explain select * from test02 where a1='x' and a1='y' ;`

### 6 . 优化案例

- 单表优化
- 两表优化
- 三表优化

#### (1) 单表优化

```mysql
create table book
(
	bid int(4) primary key,
	name varchar(20) not null,
	authorid int(4) not null,
	publicid int(4) not null,
	typeid int(4) not null
);
insert into book values(1,'tjava',1,1,2) ;
insert into book values(2,'tc',2,1,2) ;
insert into book values(3,'wx',3,2,1) ;
insert into book values(4,'math',4,2,3) ;
commit;
```

场景 1：查询 authorid=1 且 typeid 为 2 或 3 的 bid

sql 语句：

`explain select bid from book where typeid in(2,3) and authorid=1 order by typeid desc ;`

> 优化一：加索引
>
> `alter table book add index idx_bta (bid,typeid,authorid);`

优化过程：

```mysq
索引一旦进行 升级优化，需要将之前废弃的索引删掉，防止干扰。
之前索引：（a,b,c) 当前索引：（a,b)会有干扰，索引删除（a,b,c)索引。
	drop index idx_bta on book;

根据SQL实际解析的顺序，调整索引的顺序：
(虽然可以回表查询bid，但是将bid放到索引中 可以提升使用using index ;)
alter table book add index idx_tab (typeid,authorid,bid);
```

> 再次优化 （之前是 index 级别）：思路。因为范围查询 in 有时会实现，因此交换 索引的顺序，将 typeid in(2,3) 放到最后。

```mysql
drop index idx_tab on book;
	alter table book add index idx_atb (authorid,typeid,bid);
	explain select bid from book where  authorid=1 and  typeid in(2,3) order by typeid desc ;
```

优化结果：达到——ref 级别

**-- 小结**

- 1.最佳做前缀，保持索引的定义和使用的顺序一致性
- 2.索引需要逐步优化
- 3.将含 In 的范围查询 放到 where 条件的最后，防止失效

注意：

```txt
本例中同时出现了Using where（需要回原表）;
               Using index（不需要回原表）：
原因，where  authorid=1 and  typeid in(2,3)中authorid在索引(authorid,typeid,bid)中，因此不需要回原表（直接在索引表中能查到）；

typeid虽然也在索引(authorid,typeid,bid)中，但是含in的范围查询已经使该typeid索引失效，因此相当于没有    typeid这个索引，所以需要回原表（using where）；

例如以下没有了In，则不会出现using where
	explain select bid from book where  authorid=1 and  typeid =3 order by typeid desc ;

还可以通过key_len证明In可以使索引失效。
```

#### (2) 两表优化

> 创建表的 sql 语句

```mysql
create table teacher2
(
	tid int(4) primary key,
	cid int(4) not null
);

insert into teacher2 values(1,2);
insert into teacher2 values(2,1);
insert into teacher2 values(3,3);

create table course2
(
	cid int(4) ,
	cname varchar(20)
);

insert into course2 values(1,'java');
insert into course2 values(2,'python');
insert into course2 values(3,'kotlin');
commit;
```

- 左连接

`explain select *from teacher2 t left outer join course2 c on t.cid=c.cid where c.cname='java';`

优化知识补充：

**(1) 索引往哪张表加？**

> 小表驱动大表

​ 索引建立经常使用的字段上 （本题 t.cid=c.cid 可知，t.cid 字段使用频繁，因此给该字段加索引） [一般情况对于左外连接，给左表加索引；右外连接，给右表加索引]

```txt
小表：10
大表：300
        where   小表.x 10 = 大表.y 300;  --循环了几次？10

                大表.y 300=小表.x 10	--循环了300次

小表:10
大表:300

	select ...where 小表.x10=大表.x300 ;
	for(int i=0;i<小表.length10;i++)
	{
		for(int j=0;j<大表.length300;j++)
		{
			...
		}
	}
 对比：
   select ...where 大表.x300=小表.x10 ;
	for(int i=0;i<大表.length300;i++)
	{
		for(int j=0;j<小表.length10;j++)
		{
			...
		}
	}

```

**以上 2 个 FOR 循环，最终都会循环 3000 次；但是 对于双层循环来说：一般建议 将数据小的循环 放外层；数据大的循环放内存**

**(2) 优化过程**

- 当编写 ..on t.cid=c.cid 时，将数据量小的表 放左边（假设此时 t 表数据量小）

  ```mysql
  alter table teacher2 add index index_teacher2_cid(cid) ;
  alter table course2 add index index_course2_cname(cname);
  ```

  **Using join buffer:extra 中的一个选项，作用：Mysql 引擎使用了 连接缓存。**

优化后的 ref 级别：

#### (3) 三表优化

- 三张表优化 A B C
- 1,小表驱动大表
- 2,索引建立在经常查询的字段上

创建表：

    ​```mysql

create table test03
(
a1 int(4) not null,
a2 int(4) not null,
a3 int(4) not null,
a4 int(4) not null
);

alter table test03 add index idx_a1_a2_a3_4(a1,a2,a3,a4) ;

explain select a1,a2,a3,a4 from test03 where a1=1 and a2=2 and a3=3 and a4 =4 ;
--推荐写法，因为 索引的使用顺序（where 后面的顺序） 和 复合索引的顺序一致

explain select a1,a2,a3,a4 from test03 where a4=1 and a3=2 and a2=3 and a1 =4 ;
--虽然编写的顺序 和索引顺序不一致，但是 sql 在真正执行前 经过了 SQL 优化器的调整，结果与上条 SQL 是一致的。
--以上 2 个 SQL，使用了 全部的复合索引

explain select a1,a2,a3,a4 from test03 where a1=1 and a2=2 and a4=4 order by a3;
--以上 SQL 用到了 a1 a2 两个索引，该两个字段 不需要回表查询 using index ;而 a4 因为跨列使用，造成了该索引失效，需要回表查询 因此是 using where；以上可以通过 key_len 进行验证

    我的理解：如果跨列则会产生回表查询产生无效索引

explain select a1,a2,a3,a4 from test03 where a1=1 and a4=4 order by a3;
--以上 SQL 出现了 using filesort(文件内排序，“多了一次额外的查找/排序”) ：不要跨列使用( where 和 order by 拼起来，不要跨列使用)

explain select a1,a2,a3,a4 from test03 where a1=1 and a4=4 order by a2 , a3; --不会 using filesort
```

**总结**

> - 如果 (a,b,c,d)复合索引 和使用的顺序全部一致(且不跨列使用)，则复合索引全部使用。如果部分一致(且不跨列使用)，则使用部分索引。select a,c where a = and b= and d=
> - iwhere 和 order by 拼起来，不要跨列使用
>
> **using temporary:需要额外再多使用一张表. 一般出现在 group by 语句中；已经有表了，但不适用，必须再来一张表。**

**解析过程**

```mysql
from .. on.. join ..where ..group by ....having ...select dinstinct ..order by limit ...
a.
explain select * from test03 where a2=2 and a4=4 group by a2,a4 ;--没有using temporary
b.
explain select * from test03 where a2=2 and a4=4 group by a3 ;
```

### 7.避免索引失效的一些原则

> (1) 复合索引
>
> - 复合索引，不要跨列或无序使用（最佳左前缀）（a,b,c）
> - 复合索引，尽量使用全索引匹配 (a,b,c) [用到的字段都用索引]
>
> (2) 不要在索引上进行任何操作（计算、函数、类型转换），否则索引失效（单独索引不影响）
>
> 举例：book 表

```mysql
select ..where A.x = .. ;  --假设A.x是索引
不要：select ..where A.x*3 = .. ;
假设（a,t,b）是一个复合索引
explain select * from book where authorid = 1 and typeid = 2 ;--用到了at 2个索引
explain select * from book where authorid = 1 and typeid*2 = 2 ;--用到了a 1个索引
explain select * from book where authorid*2 = 1 and typeid*2 = 2 ;----用到了 0个索引
explain select * from book where authorid*2 = 1 and typeid = 2 ;----用到了0个索引,
原因：对于复合索引，如果左边失效，右侧全部失效。(a,b,c)，例如如果 b失效，则b c同时失效。

drop index idx_atb on book ;
alter table book add index idx_authroid (authorid) ;
alter table book add index idx_typeid (typeid) ;
explain select * from book where authorid*2 = 1 and typeid = 2 ;
```

> (3) 复合索引不能使用不等于（!= <>）或 is null (is not null)，否则自身以及右侧所有全部失效。复合索引中如果有>，则自身和右侧索引全部失效。

`explain select * from book where authorid = 1 and typeid =2 ;`

注意：

- SQL 优化，是一种概率层面的优化。至于是否实际使用了我们的优化，需要通过 explain 进行推测。

```mysql
explain select * from book where authorid != 1 and typeid =2 ;
explain select * from book where authorid != 1 and typeid !=2 ;
```

**体验概率情况(< > =)：原因是服务层中有 SQL 优化器，可能会影响我们的优化。**

```mysql
drop index idx_typeid on book;
drop index idx_authroid on book;
alter table book add index idx_book_at (authorid,typeid);
explain select * from book where authorid = 1 and typeid =2 ;--复合索引at全部使用
explain select * from book where authorid > 1 and typeid =2 ; --复合索引中如果有>，则自身和右侧索引全部失效。
explain select * from book where authorid = 1 and typeid >2 ;--复合索引at全部使用
----明显的概率问题---
explain select * from book where authorid < 1 and typeid =2 ;--复合索引at只用到了1个索引
explain select * from book where authorid < 4 and typeid =2 ;--复合索引全部失效
```

> 我们学习索引优化 ，是一个大部分情况适用的结论，但由于 SQL 优化器等原因 该结论不是 100%正确。
> 一般而言， 范围查询（> < in），之后的索引失效。

> (4) 补救。尽量使用索引覆盖（using index）.比如（a,b,c）
>
> `select a,b,c from xx..where a= .. and b =.. ;`

> (5) like 尽量以“常量”开头，不要以'%'开头，否则索引失效

```mysql
select * from xx where name like '%x%' ; --name索引失效
explain select * from teacher  where tname like '%x%'; --tname索引失效
explain select * from teacher  where tname like 'x%';
explain select tname from teacher  where tname like '%x%';
--如果必须使用like '%x%'进行模糊查询，可以使用索引覆盖 挽救一部分。
```

> （6）尽量不要使用类型转换（显示、隐式），否则索引失效

```mysql
explain select * from teacher where tname = 'abc' ;
explain select * from teacher where tname = 123 ;//程序底层将 123 -> '123'，即进行了类型转换，因此索引失效
```

> （7）尽量不要使用 or，否则索引失效

```mysql
explain select * from teacher where tname ='' or tcid >1 ; --将or左侧的tname 失效。
```

### 8. 其他的优化方法

#### （1）exist 和 in

```mysql
select ..from table where exist (子查询) ;
select ..from table where 字段 in  (子查询) ;
```

- 如果主查询的数据集大，则使用 In , 效率高。
  如果子查询的数据集大，则使用 exist, 效率高。
- 我的理解：想要效率高：子查询**数据集大就用 exist**,子查询**数据集小就用 in**进行对应的子查询

语法复习：

> exist 语法： 将主查询的结果，放到子查需结果中进行条件校验（看子查询是否有数据，如果有数据 则校验成功）, 如果 复合校验，则保留数据；
>
> ```mysql
> select tname from teacher where exists (select * from teacher) ;
>    --等价于select tname from teacher
> select tname from teacher where exists (select * from teacher where tid =9999) ;
>
> in:
> select ..from table where tid in  (1,3,5) ;
> ```

#### （2）order by 优化

​ **using filesort 有两种算法：双路排序、单路排序 （根据 IO 的次数）**

> MySQL4.1 之前 默认使用 双路排序；双路：扫描 2 次磁盘
>
> - 1,从磁盘读取排序字段 ,对排序字段进行排序（在 buffer 中进行的排序）
> - 2，扫描其他字段 ）
>
> 注意：**IO 较消耗性能**

> MySQL4.1 之后 默认使用 单路排序 ： 只读取一次（全部字段），在 buffer 中进行排序。
>
> - 但种单路排序 会有一定的隐患 （不一定真的是“单路|1 次 IO”，有可能多次 IO）。
> - 原因：如果数据量特别大，则无法 将所有字段的数据 一次性读取完毕，因此 会进行“分片读取、多次读取”。

注意：

- 1，单路排序 比双路排序 会占用更多的 buffer。

- 2，单路排序在使用时，如果数据大，可以考虑调大 buffer 的容量大小：

  `set max_length_for_sort_data = 1024 单位byte`

- 3，如果 max_length_for_sort_data 值太低，则 mysql 会自动从 单路->双路

  解释：(太低：需要排序的列的总大小超过了 max_length_for_sort_data 定义的字节数）

**提高 order by 查询的策略：**

> a.选择使用单路、双路 ；调整 buffer 的容量大小；
> b.避免 select \* ...  
> c.复合索引 不要跨列使用 ，避免 using filesort
> d.保证全部的排序字段 排序的一致性（都是升序 或 降序）

### 9. SQL 排查 - 慢查询日志

**MySQL 提供的一种日志记录，用于记录 MySQL 种响应时间超过阀值的 SQL 语句 （long_query_time，默认 10 秒）**

- 查询日志默认是关闭的；
- 建议：开发调优是 打开，而 最终部署时关闭。

#### （1）基本操作

- 检查是否开启了 慢查询日志 ： show variables like '%slow_query_log%' ;

- 临时开启：

  ```mysql
  set global slow_query_log = 1 ;  --在内存种开启
  exit
  service mysql restart
  ```

- 永久开启：

  ```mysql
  /etc/my.cnf 中追加配置：
  vi /etc/my.cnf
  [mysqld]
  slow_query_log=1
  slow_query_log_file=/var/lib/mysql/localhost-slow.log
  ```

- 慢查询阀值：

  `show variables like '%long_query_time%' ;`

- 临时设置阀值：

​ `set global long_query_time = 5 ; --设置完毕后，重新登陆后起效 （不需要重启服务）`

- 永久设置阀值：

  ```mysql
  /etc/my.cnf 中追加配置：
  vi /etc/my.cnf
  [mysqld]
  long_query_time=3
  ```

> select sleep(4);
> select sleep(5);
> select sleep(3);
> select sleep(3);
>
> - 查询超过阀值的 SQL： show global status like '%slow_queries%' ;

#### （2）慢查询的定位方式

- (1)慢查询的 sql 被记录在了日志中，因此可以通过日志 查看具体的慢 SQL。
  `cat /var/lib/mysql/localhost-slow.log`

- (2)通过 mysqldumpslow 工具查看慢 SQL,可以通过一些过滤条件 快速查找出需要定位的慢 SQL

  > mysqldumpslow --help
  >
  > s：排序方式
  > r:逆序
  > l:锁定时间
  > g:正则匹配模式

```mysql
--获取返回记录最多的3个SQL
	mysqldumpslow -s r -t 3  /var/lib/mysql/localhost-slow.log

--获取访问次数最多的3个SQL
	mysqldumpslow -s c -t 3 /var/lib/mysql/localhost-slow.log

--按照时间排序，前10条包含left join查询语句的SQL
	mysqldumpslow -s t -t 10 -g "left join" /var/lib/mysql/localhost-slow.log

语法：
	mysqldumpslow 各种参数  慢查询日志的文件
```

### 10.分析海量数据

#### (1).模拟海量数据

- 模拟海量数据 存储过程（无 return）/存储函数（有 return）

```mysql
create table dept
(
dno int(5) primary key default 0,
dname varchar(20) not null default '',
loc varchar(30) default ''
)engine=innodb default charset=utf8;

create table emp
(
eid int(5) primary key,
ename varchar(20) not null default '',
job varchar(20) not null default '',
deptno int(5) not null default 0
)engine=innodb default charset=utf8;
```

- 通过存储函数 插入海量数据：

- 创建存储函数：(创建随机字符串，用来模拟字段)

  `randstring(6) ->aXiayx 用于模拟员工名称`

- 0-1 \*52 [0 52)

- delimiter[定界符] \$

创建存储过程函数的 sql 语法：

- （1）产生随机字符串

```mysql
delimiter $
	create function randstring(n int)   returns varchar(255)
	begin
		declare  all_str varchar(100) default                          'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ' ;
		declare return_str varchar(255) default '' ;
		declare i int default 0 ;
		while i<n
		do
			set return_str = concat(return_str, substring(all_str, FLOOR(1+rand()*52),1));
			set i=i+1 ;
		end while ;
		return return_str;
	end $
```

**注意：**

- 若提示：Display all 780 possibilities? (y or n)，则 删除语句中所有疑似 tab 键，再次执行，问题解决！

- 如果报错：You have an error in your SQL syntax，说明 SQL 语句语法有错，需要修改 SQL 语句；

- 如果报错 This function has none of DETERMINISTIC, NO SQL, or READS SQL DATA in its declaration and binary logging is enabled (you _might_ want to use the less safe log_bin_trust_function_creators variable)

是因为 存储过程/存储函数在创建时 与之前的 开启慢查询日志冲突了

**解决冲突：**

> 1,临时解决( 开启 log_bin_trust_function_creators )
>
> show variables like '%log_bin_trust_function_creators%';
> set global log_bin_trust_function_creators = 1;
>
> 2,永久解决：
>
> /etc/my.cnf
> [mysqld]下设置如下字段：
> log_bin_trust_function_creators = 1

（2）产生随机整数

```mysql
create function ran_num() returns int(5)
begin
	declare i int default 0;
	set i =floor( rand()*100 ) ;
	return i ;

end $
```

(3) 通过存储过程插入海量数据：emp 表中 ， 10000, 100000

```mysql
create procedure insert_emp( in eid_start int(10),in data_times int(10))
begin
	declare i int default 0;
	set autocommit = 0 ;

	repeat

		insert into emp values(eid_start + i, randstring(5) ,'other' ,ran_num()) ;
		set i=i+1 ;
		until i=data_times
	end repeat ;
	commit ;
end $
```

(4) 通过存储过程插入海量数据：dept 表中

```mysql
create procedure insert_dept(in dno_start int(10) ,in data_times int(10))
begin
	declare i int default 0;
	set autocommit = 0 ;
	repeat

		insert into dept values(dno_start+i ,randstring(6),randstring(8)) ;
		set i=i+1 ;
		until i=data_times
	end repeat ;
commit ;
end$
```

(5) 插入数据

```mysql
//定义分割符 改为 ；
delimiter ;
call insert_emp(1000,800000) ;
call insert_dept(10,30) ;

```

#### (2).分析海量数据

> ##### 1,profiles
>
> - show profiles ; --默认关闭
>
> - show variables like '%profiling%';
>
> - set profiling = on ;
>
>   解释说明：show profiles ：会记录所有 profiling 打开之后的 全部 SQL 查询语句所花费的时间。缺点：不够精确，只能看到 总共消费的时间，不能看到各个硬件消费的时间（cpu io ）

> ##### 2,精确分析:sql 诊断
>
> - show profile all for query 上一步查询的的 Query_Id
> - show profile cpu,block io for query 上一步查询的的 Query_Id
>
> ##### 3,全局查询日志
>
> ​ 记录开启之后的 全部 SQL 语句。 （这次全局的记录操作 仅仅在调优、开发过程中打开即可，在最终的部署实施时 一定关闭）;
>
> 操作指令：show variables like '%general_log%';
>
> - 执行的所有 SQL 记录在表中
>
>   ```mysql
>   show variables like '%general_log%'; --查看全局日志是否开启
>   set global general_log = 1 ;--开启全局日志
>   set global log_output='table' ; --设置 将全部的SQL 记录在表中
>   ```
>
> - 执行的所有 SQL 记录在文件中
>
>   ```mysql
>   set global log_output='file' ;
>   set global general_log = on ;
>   set global general_log_file='/tmp/general.log' ;
>   ```
>
> - 开启后，会记录所有 SQL ： 会被记录 mysql.general_log 表中。
>
>   `select * from mysql.general_log ;`

### 11. 锁机制

定义：解决因资源共享 而造成的并发问题。

| 示例：买最后一件衣服 X                                 |
| ------------------------------------------------------ |
| A: X 买 ： X 加锁 ->试衣服...下单..付款..打包 ->X 解锁 |
| B: X 买：发现 X 已被加锁，等待 X 解锁， X 已售空       |

#### （1）分类

- 操作类型

  a.读锁（共享锁）： 对同一个数据（衣服），多个读操作可以同时进行，互不干扰。
  b.写锁（互斥锁）： 如果当前写操作没有完毕（买衣服的一系列操作），则无法进行其他的读操作、写操作

- 操作范围

  a.表锁：

  ​ 一次性对**一张表整体**加锁。如 MyISAM 存储引擎使用表锁，开销小、加锁快；无死锁；但锁的范围大，容易发生锁冲突、并发度低。

  b.行锁 ：

  ​ 一次性对**一条数据**加锁。如 InnoDB 存储引擎使用行锁，开销大，加锁慢；容易出现死锁；锁的范围较小，不易发生锁冲突，并发度高（很小概率 发生高并发问题：脏读、幻读、不可重复度、丢失更新等问题）。
  c.页锁

#### （2）实例实战

##### 1. 表锁（MyISAM）

> 自增操作 MYSQL/SQLSERVER 支持；oracle 需要借助于序列来实现自增

- 举例

  ```mysql
  create table tablelock
  (
  id int primary key auto_increment ,
  name varchar(20)
     )engine myisam;

  insert into tablelock(name) values('a1');
  insert into tablelock(name) values('a2');
  insert into tablelock(name) values('a3');
  insert into tablelock(name) values('a4');
  insert into tablelock(name) values('a5');
  commit;
  ```

  **（1）增加锁语法：**

  ​ `lock table 表1 read/write ,表2 read/write ,...`

  （2）查看加锁的表：

  ​ `show open tables ;`

  - **注意：**会话(session) :每一个访问数据的 dos 命令行、数据库客户端工具 都是一个会话

  （3）加读锁：

  ​ `lock table tablelock read;`

  ​ **会话 0**

  ```mysql
  lock table  tablelock read ;
  select * from tablelock; --读（查），可以
  delete from tablelock where id =1 ; --写（增删改），不可以

  select * from emp ; --读，不可以
  delete from emp where eid = 1; --写，不可以
  结论1：
    --如果某一个会话 对A表加了read锁，则 该会话 可以对A表进行读操作、不能进行写操作； 且 该会话不能对其他表进行读、写操作。
    --即如果给A表加了读锁，则当前会话只能对A表进行读操作。
  ```

  - 其他会话对会话 0 加锁后的操作情况 ：

    **会话 1**（其他会话）

  ```mysql
  select * from tablelock;   --读（查），可以
  delete from tablelock where id =1 ; --写，会“等待”会话0将锁释放
  ```

  - 其他会话对其他未加锁表的操作情况：

    **会话 2**（其他会话）

    ```mysql
    select * from emp ;  --读（查），可以
    delete from emp where eid = 1; --写，可以
    结论2：
    --总结：
    会话0给A表加了锁；其他会话的操作：
              a.可以对其他表（A表以外的表）进行读、写操作。
                  b.对A表：读-可以；写-需要等待释放锁。
    ```

  (4) 释放锁

  ​ `unlock tables ;`

  ​

  **（5）加写锁的操作**

  - 会话 0

    ```mysql
    lock table tablelock write ;

    当前会话（会话0） 可以对加了写锁的表  进行任何操作（增删改查）；但是不能 操作（增删改查）其他表
    ```

  - 会话 1（其他会话）

    ```mysql
    对会话0中加写锁的表 可以进行增删改查的前提是：等待会话0释放写锁
    ```

  ​ **（6）MySQL 表级锁的锁模式**

  ​ MyISAM 在执行查询语句（SELECT）前，会自动给涉及的所有表加读锁，在执行更新操作（DML）前，会自动给涉及的表加写锁。所以对 MyISAM 表进行操作，会有以下情况：
  a、对 MyISAM 表的读操作（加读锁），不会阻塞其他进程（会话）对同一表的读请求，
  但会阻塞对同一表的写请求。只有当读锁释放后，才会执行其它进程的写操作。
  b、对 MyISAM 表的写操作（加写锁），会阻塞其他进程（会话）对同一表的读和写操作，
  只有当写锁释放后，才会执行其它进程的读写操作。

  ​ **（7）分析表锁定：**

  > - 查看哪些表加了锁:`show open tables ; 1代表被加了锁`
  >
  > - 分析表锁定的严重程度：show status like 'table%' ;
  >
  >   1,Table_locks_immediate :即可能获取到的锁数.
  >
  >   2,Table_locks_waited：需要等待的表锁数《我的理解：已经加锁的个数》(如果该值越大，说明存在越大的锁竞争)
  >
  > - 一般建议：
  >
  >   Table_locks_immediate/Table_locks_waited > 5000， 建议采用 InnoDB 引擎，否则 MyISAM 引擎

##### 2. 行锁(innodb)

```mysql
create table linelock(
id int(5) primary key auto_increment,
name varchar(20)
)engine=innodb ;
insert into linelock(name) values('1')  ;
insert into linelock(name) values('2')  ;
insert into linelock(name) values('3')  ;
insert into linelock(name) values('4')  ;
insert into linelock(name) values('5')  ;
```

> mysql 默认自动 commit; oracle 默认不会自动 commit ;

- 为了研究行锁，暂时将自动 commit 关闭; set autocommit =0 ; 以后需要通过 commit

**会话 0：**写操作

​ `insert into linelock values( 'a6') ;`

**会话 1：** 写操作 同样的数据

​ `update linelock set name='ax' where id = 6;`

- 对行锁情况：

  1，如果会话 x 对某条数据 a 进行 DML 操作（研究时：关闭了自动 commit 的情况下），则其他会话必须等待会话 x 结束事务(commit/rollback)后 才能对数据 a 进行操作。

  2，表锁 是通过 unlock tables，也可以通过事务解锁 ; 行锁 是通过事务解锁。

**行锁，操作不同数据：**

**会话 0： **写操作

`insert into linelock values(8,'a8') ;`

**会话 1：**写操作， 不同的数据

```mysql
update linelock set name='ax' where id = 5;
行锁，一次锁一行数据；因此 如果操作的是不同数据，则不干扰。
```

- 行锁的注意事项：

  a.如果没有索引，则行锁会转为表锁

  ```mysql
  show index from linelock ;
  alter table linelock add index idx_linelock_name(name);
  ```

  | 会话 0： 写操作                                     |
  | --------------------------------------------------- |
  | update linelock set name = 'ai' where name = '3' ;  |
  | 会话 1： 写操作， 不同的数据                        |
  | update linelock set name = 'aiX' where name = '4' ; |

  | 会话 0： 写操作                                   |
  | ------------------------------------------------- |
  | update linelock set name = 'ai' where name = 3 ;  |
  | 会话 1： 写操作， 不同的数据                      |
  | update linelock set name = 'aiX' where name = 4 ; |

- 可以发现，数据被阻塞了（加锁）

- 原因：如果索引类 发生了类型转换，则索引失效。 因此 此次操作，会从行锁 转为表锁。

  ​

  b.行锁的一种特殊情况：间隙锁：值在范围内，但却不存在

  此时 linelock 表中 没有 id=7 的数据

  `update linelock set name ='x' where id >1 and id<9 ;`

  即在此 where 范围中，没有 id=7 的数据，则 id=7 的数据成为间隙。

  **间隙**：Mysql 会自动给 间隙 加索 ->间隙锁。即 本题 会自动给 id=7 的数据加 间隙锁（行锁）。
  **行锁**：如果有 where，则实际加索的范围 就是 where 后面的范围（不是实际的值）

  ​

  (1) 如何仅仅是查询数据，能否加锁？ 可以 for update

  研究学习时，将自动提交关闭：

  ```mysql
  	set autocommit =0 ;
  	start transaction ;
  	begin ;
  	select * from linelock where id =2 for update ;
      通过for update对query语句进行加锁。
  ```

  (2)小结：

  行锁：

  - InnoDB 默认采用行锁；
  - 缺点： 比表锁性能损耗大。
  - 优点：并发能力强，效率高。
  - 因此建议，高并发用 InnoDB，否则用 MyISAM。

  **行锁分析：**

  ```mysql
  show status like '%innodb_row_lock%' ;
  Innodb_row_lock_current_waits :当前正在等待锁的数量
  Innodb_row_lock_time：等待总时长。从系统启到现在 一共等待的时间
  Innodb_row_lock_time_avg  ：平均等待时长。从系统启到现在平均等待的时间
  Innodb_row_lock_time_max  ：最大等待时长。从系统启到现在最大一次等待的时间
  Innodb_row_lock_waits ：	等待次数。从系统启到现在一共等待的次数
  ```

  ​

### 12. 主从复制

- 集群在数据库的一种实现
- windows:mysql 主
- linux:mysql 从

#### (1) 安装 windows 版 mysql

- 如果之前计算机中安装过 Mysql，要重新再安装 则需要：先卸载 再安装

      	 先卸载：

  ​ 1,通过电脑自带卸载工具卸载 Mysql (电脑管家也可以)

  ​ 2,删除一个 mysql 缓存文件 C:\ProgramData\MySQL

  ​ 3,删除注册表 regedit 中所有 mysql 相关配置

  ​ 4,重启计算机

- 安装 MYSQL：

  ​ 安装时，如果出现未响应： 则重新打开 D:\MySQL\MySQL Server 5.5\bin\MySQLInstanceConfig.exe

- 图形化客户端： SQLyog, Navicat

**注意** ：如果要远程连接数据库，则需要授权远程访问。

- 授权远程访问 :(A->B,则再 B 计算机的 Mysql 中执行以下命令)

  ```mysql
  GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY 'root' WITH GRANT OPTION;
  FLUSH PRIVILEGES;
  ```

- 如果仍然报错：可能是防火墙没关闭 ： 在 B 关闭防火墙 service iptables stop

#### (2) 实现主从复制

1.master 将改变的数 记录在本地的 二进制日志中（binary log） ；该过程 称之为：二进制日志件事
2.slave 将 master 的 binary log 拷贝到自己的 relay log（中继日志文件）中 3.中继日志事件，将数据读取到自己的数据库之中

- MYSQL 主从复制 是异步的，串行化的， 有延迟

**master:slave = 1:n**

| 配置：windows(mysql: my.ini) |
| ---------------------------- |
| **linux(mysql: my.cnf)**     |

**1，配置前**：为了无误，先将权限(远程访问)、防火墙等处理：

- 关闭 windows/linux 防火墙： windows：右键“网络” ,linux: service iptables stop

- Mysql 允许远程连接(windowos/linux)：

  ```mysql
  GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY 'root' WITH GRANT OPTION;
  FLUSH PRIVILEGES;
  ```

**2,主机**（以下代码和操作 全部在主机 windows 中操作）：

```mysql
my.ini
[mysqld]
#id
server-id=1
#二进制日志文件（注意是/  不是\）
log-bin="D:/MySQL/MySQL Server 5.5/data/mysql-bin"
#错误记录文件
log-error="D:/MySQL/MySQL Server 5.5/data/mysql-error"
#主从同步时 忽略的数据库
binlog-ignore-db=mysql
#(可选)指定主从同步时，同步哪些数据库
binlog-do-db=test
windows中的数据库 授权哪台计算机中的数据库 是自己的从数据库：
 GRANT REPLICATION slave,reload,super ON *.* TO 'root'@'192.168.2.%' IDENTIFIED BY 'root';
 flush privileges ;

查看主数据库的状态（每次在左主从同步前，需要观察 主机状态的最新值）
show master status;  （mysql-bin.000001、 107）
```

**2,从机**（以下代码和操作 全部在从机 linux 中操作）：

```mysql
my.cnf
[mysqld]
server-id=2
log-bin=mysql-bin
replicate-do-db=test

linux中的数据 授权哪台计算机中的数控 是自己的主计算机
CHANGE MASTER TO
MASTER_HOST = '192.168.2.2',
MASTER_USER = 'root',
MASTER_PASSWORD = 'root',
MASTER_PORT = 3306,
master_log_file='mysql-bin.000001',
master_log_pos=107;
	如果报错：This operation cannot be performed with a running slave; run STOP SLAVE first
	解决：STOP SLAVE ;再次执行上条授权语句
```

**3,开启主从同步：**

```mysql
从机linux:
start slave ;
检验  show slave status \G
主要观察： Slave_IO_Running和 Slave_SQL_Running，确保二者都是yes；如果不都是yes，则看下方的 Last_IO_Error。
本次 通过 Last_IO_Error发现错误的原因是 主从使用了相同的server-id，
检查:在主从中分别查看serverid:  show variables like 'server_id' ;
可以发现，在Linux中的my.cnf中设置了server-id=2，但实际执行时 确实server-id=1，原因：可能是 linux版Mysql的一个bug，也可能是 windows和Linux版本不一致造成的兼容性问题。
解决改bug： set global server_id =2 ;
	stop slave ;
	set global server_id =2 ;
	start slave ;
	show slave status \G

	演示：
	主windows =>从

	windows:
	将表，插入数据
	观察从数据库中该表的数据
```

**4,主要场景；**

- 数据库+后端

  spring boot（企业级框架,目前使用较多）

* [视频记录](https://www.bilibili.com/watchlater/#/av29072634/p9)
* [优秀笔记地址](https://zhuanlan.zhihu.com/p/81922471?utm_source=qq&utm_medium=social&utm_oi=829272701691658240)
