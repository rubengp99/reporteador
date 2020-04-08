# Reporteador

## English description.

This is a management system for financial intelligence developed during my internships at Somos Sistemas C.A. It is in charge of managing information related to the company that uses it, generating reports that represent support material for decision-making. This project is still under development.

## Descripción en español.

Este es un sistema de gestión para la inteligencia financiera desarrollado durante mis pasantias en Somos Sistemas C.A. Se encarga de la gestión de información relacionada con la empresa que lo utiliza, generando reportes que representan un material de apoyo para la toma de decisiones. Este proyecto sigue en desarrollo.

### [Demo](http://reporteadordemo.000webhostapp.com)


## Auth / Login / Password Recover

***(English)*** Since it is a management system, it is clearly mandatory for the user to log in before proceeding. Any attempt to access a path through the URL will result in a redirect to this page.

___

***(Español)*** Dado que es un sistema de gestión, es netamente obligatorio que el usuario inicie sesión antes de proceder. Cualquier intento de acceso a una ruta a través de la URL terminará en una redirección hacia esta página.

![1](capturas/login.png)

***(English)*** In the event that the user has forgotten their password and thinks that the system is inaccessible, then they do not have to worry, the password can be recovered, since the account has a linked email for these cases.

___

***(Español)*** En el caso de que el usuario haya olvidado su contraseña y piense que el sistema es inaccesible, entonces no tiene que preocuparse, se puede recuperar la contraseña, ya que la cuenta tiene un correo electronico enlazado para estos casos.

![2](capturas/recover.png)


## Dashboard.

***(English)*** Once the credentials have been verified, the user will be able to access the management system. The first thing you will see is this Dashboard, with information related to your movements for the day.

___

***(Español)*** Una vez que las credenciales han sido comprobadas, el usuario podrá acceder al sistema de gestión. Lo primero que verá será este Dashboard, con información relacionada a sus movimientos del día.

![3](capturas/dashboard1.png)

![4](capturas/dashboard2.png)


## Inventory / Inventario.

***(English)*** In this module the user is able to see all the concepts (products) that have been registered by the company, and in the same way, information related to them. Includes statistical analysis of the movements of each product. All the data can be filtered & ordered with the controls inside the table

___

***(Español)*** En este módulo el usuario es capaz de ver todos los conceptos (productos) que han sido registrados por la empresa, y de la misma manera, información relacionada a los mismos. Incluye analisis estadisticos de los movimientos de cada producto. Toda la información puede ser ordenada y filtrada con los controles añadidos en la tabla.


![5](capturas/storage.png)

### Concept (Product) / Concepto (Producto)

***(English)*** Each concept has information related to its registration, and its stocks in the warehouse.

___

***(Español)*** Cada concepto posee información relacionada con su registro, y sus existencias en el almacen.
 
![6](capturas/item1.png)

![7](capturas/item2.png)

### Charts / Gráficos

***(English)*** Each concept has a series of graphics related to a type of report. The results obtained by them are those that will be used by the company to determine profitability indicators and other variables to improve the company's productivity.

___

***(Español)*** Cada concepto posee una serie gráficos relacionados con un tipo de reporte. Los resultados arrojados por los mismos son los que serán utilizados por la empresa para determinar indicadores de rentabilidad y otras variables para mejorar la productividad de la empresa.


#### Stock Rotation & Weekly demand / Rotación de Inventario & Demanda Semanal

***(English)*** Charts to communicate the weekly demand for the concept, and the turnover index it has in inventory, that is, how much it moves in the market.

___

***(Español)*** Gráficas para comunicar la demanda semanal del concepto, y el indice de rotación que tiene en el inventario, es decir, que tanto se mueve el mismo en el mercado.

![6](capturas/chart1.png)


#### Stock claims & Stock devolutions / Reclamos y devoluciones del Inventario

***(English)*** Charts to determine the rate of claims and returns that a concept has in the market. Depending on the results, this may affect the possibility of ceasing to distribute this concept.

___

***(Español)*** Gráficas para determinar el indice de reclamos y devoluciones que tiene un concepto en el mercado. Dependiendo de los resultados, esto puede incidir en la posibilidad de dejar de distribuir este concepto.

![6](capturas/chart2.png)


#### Stock depletion && Cost effectiveness & Agotamiento de inventario y Rentabilidad

***(English)*** Charts indicating an estimated date for stock depletion. With this, the company can take the necessary measures to replenish stocks. This is calculated from the weekly demand that a concept has. In addition to this, there is profitability, a relational calculation between the concept's purchase cost and its retail price. A value of around 30% is usually expected.

___

***(Español)*** Gráficas que indican una fecha estimada para el agotamiento de las existencias. Con esto la empresa puede ir tomando las medidas necesarias para reponer las existencias. Esto se calcula a partir de la demanda semanal que tiene un concepto. Aunado a ello, está la rentabilidad, calculo relacional entre el costo compra del concepto y su precio de venta al público. Usualmente se espera un valor alrededor del 30%.

![6](capturas/chart3.png)

![7](capturas/chart4.png)

Coded with :heart: by [Rubén García](https://rubengarcia.herokuapp.com/)

