#include <iostream>
#include <ctime> // Заголовочный файл, содержащий функции работы со временем
#include <cmath>
#include <cstring> // memcpy
#include <iomanip> // setprecision
using namespace std;

#define pow powl
#define sqrt sqrtl
#define floor floorl


typedef long double my_real;

inline bool isFullSquare(my_real n){
//	cout << n << "..." <<endl;
/*	my_real f = floor(n);
	if(f-floor(f)>1.0/1024/1024)
		return false;*/
//	static my_real s = 0;
	my_real s = sqrt(n);
	return /*s==floor(s) ||*/ s-floor(s)<1.0/1024/1024;
//	return sqrt(n)-floor(sqrt(n))<1.0/1024/1024;

//	return isFullSquare((long long)floor(n));
}


my_real
	*quad_x,
	*quad_y,
	*duet_x,
	*duet_y,
	*osev_x,
	*osev_y;

size_t
	quad_l, duet_l, osev_l;


void getCandidatePoints_quad(int d){
	my_real*	l_x = quad_x;
	my_real*	l_y = quad_y;

	//Точки, которые по 4
	int d2 = pow(d,2);
	for(int a=1; a<=d; a++){
		// a < b
		my_real a2 = pow(a,2);
		for(int b=max(d-a,a)+1; b<=d; b++){
			my_real y = (a2+d2 - pow(b,2))/(2*d);
			my_real x = sqrt(a2-pow(y,2));

			*(l_x++) = x;
			*(l_y++) = y;
			quad_l++;

			*(l_x++) = x;
			*(l_y++) = d-y;
			quad_l++;

			*(l_x++) = -x;
			*(l_y++) = y;
			quad_l++;

			*(l_x++) = -x;
			*(l_y++) = d-y;
			quad_l++;
		}
	}



}

void getCandidatePoints_duet(int d){

	my_real*	l_x = duet_x;
	my_real*	l_y = duet_y;

	// Точки, которые по 2
	my_real y = d/2;
	my_real y2 = pow(y,2);
	for(int a=floor(y+1); a<=d; a++){
		my_real x = sqrt(pow(a,2)-y2);
		*(l_x++) = x;
		*(l_y++) = y;
		duet_l++;

		*(l_x++) = -x;
		*(l_y++) = y;
		duet_l++;
	}

}

void getCandidatePoints_osev(int d){
	//Осевые точки
	my_real*	l_x = osev_x;
	my_real*	l_y = osev_y;

	for(int a=1; a<d; a++){

		*(l_x++) = 0;
		*(l_y++) = a;
		osev_l++;
	}
}

void getCandidatePoints(int d){
	// Получаем начальное время в относительных единицах
	unsigned int start_time =  clock();

	int length = d*(d+2);

	quad_x = new my_real[length];
	quad_y = new my_real[length];
	duet_x = new my_real[length];
	duet_y = new my_real[length];
	osev_x = new my_real[length];
	osev_y = new my_real[length];


	getCandidatePoints_quad(d);
	getCandidatePoints_duet(d);
	getCandidatePoints_osev(d);

	// Конечное время в относительных единицах
	unsigned int end_time = clock();
	// Искомое время в секундах
	my_real total_time=1.0*(end_time - start_time)/CLOCKS_PER_SEC;
	//CLOCKS_PER_SEC равен количеству относительных единиц в секунде
	cout<<"Массивы точек-кандидатов составлены ("<<total_time<<" с), всего точек: "<<(quad_l+duet_l+osev_l)<<endl;
}


bool reduce(my_real* arr_x, my_real* arr_y, size_t& arr_l, unsigned short step, int p){
	size_t old_l = arr_l;

	my_real** points_x = new my_real*[3];
	my_real** points_y = new my_real*[3];
	size_t ** points_l = new size_t *[3];

	points_x[0] = quad_x;
	points_x[1] = duet_x;
	points_x[2] = osev_x;

	points_y[0] = quad_y;
	points_y[1] = duet_y;
	points_y[2] = osev_y;

	points_l[0] = &quad_l;
	points_l[1] = &duet_l;
	points_l[2] = &osev_l;


	for(size_t i = 0; i < arr_l; i+=step){
//		cout << "!"<<endl;
		unsigned short friends = p - (2 - 1); //2 общих минус 1 - сама точка
		size_t j;
		short q;
		for(q = 0; q < 3  && friends; q++){
			for(j = 0; j < *points_l[q] && friends; j++){
//				cout << "!!"<<arr_x[i]<<" "<<points_x[q][j]<< "!!"<<arr_y[i]<<" "<<points_y[q][j]<<endl;
				if(isFullSquare(
					pow(arr_x[i]-points_x[q][j],2.0)+
					pow(arr_y[i]-points_y[q][j],2.0)//+
					//1.0/1024/1024 // Довесок на случай ошибок округления
				)){
					// TODO: функции про полный квадрат передаётся дробь. Возможно, этим можно воспользоваться
					friends--;
				}
//				cout << "!!!"<<endl;

			}
		}
		if(friends){
			memcpy(arr_x+i,arr_x+arr_l-step,step*sizeof(my_real));
			memcpy(arr_y+i,arr_y+arr_l-step,step*sizeof(my_real));
			arr_l-=step;
			i-=step;
//			cout << "?" <<endl;
//		} else {
//			cout << friends <<" " << j <<endl;
		}
/*		if((i & 255) == 0 || (arr_l & 255) == 0){
			clog<<"Осталось обработать точек: "<<arr_l-i<<endl;
		}*/
	}
	cout << "Граф урезан (шаг "<<step<<"), было "<<old_l<<", стало "<<arr_l<<endl;
	return old_l != arr_l;
}

bool reduceWrapper(my_real* arr_x, my_real* arr_y, size_t& arr_l, unsigned short step, int p){

	// Получаем начальное время в относительных единицах
	unsigned int start_time =  clock();

	bool rez = reduce(arr_x, arr_y, arr_l, step, p);

	unsigned int end_time = clock();
	my_real total_time=1.0*(end_time - start_time)/CLOCKS_PER_SEC;
	cout<<"На обрезку графа затрачено ("<<total_time<<" с), всего точек: "<<(quad_l+duet_l+osev_l)<<endl;
	return rez;
}

int main(){
	cout<<"Поехали!"<<endl;

	// Получаем начальное время в относительных единицах
	unsigned int start_time =  clock();

	cout<<setprecision(15);

	getCandidatePoints(/*677*/91);

/*	clog << osev_y[osev_l-3] << endl;
	clog << duet_x[duet_l-3] << endl;
	clog << quad_x[quad_l-3] << endl;
*/
	reduceWrapper(quad_x, quad_y, quad_l, 4, 14/*39*/);
	reduceWrapper(quad_x, quad_y, quad_l, 4, 14/*39*/);
/*
	long double t = ((long double)1-0.000738552)*(1-0.000738552)+ ((long double)83.4046- 605.281)*(83.4046- 605.281);
	cout<<t<<endl<<t-floorl(t)<<endl;
	t*=100;
	cout<<t<<endl<<t-floorl(t)<<endl;
*/

	// Конечное время в относительных единицах
	unsigned int end_time = clock();
	// Искомое время в секундах
	unsigned int total_time=1.0*(end_time - start_time)/CLOCKS_PER_SEC;
	//CLOCKS_PER_SEC равен количеству относительных единиц в секунде
	cout<<total_time<<endl;
	return 0;
}
