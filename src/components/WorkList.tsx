'use client';

import React from 'react';
import styles from '../app/styles/WorkList.module.css';
import Work from './Work';
import { workData } from '../../data.js';
import { useUserContext } from '../context/userContext';
import PageWrap from './common/PageWrap';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const WorkList = () => {
  const { isEnglish } = useUserContext();

  return (
    <PageWrap title="Works">
      <div className={styles.wrapper}>
        <Swiper
          slidesPerView={'auto'}
          centeredSlides={true}
          spaceBetween={30}
          loop={true}
          pagination={{
            clickable: true,
          }}
          autoplay={{
            delay: 2500, // 지연 시간 (한 슬라이더에 머물르는 시간)
            disableOnInteraction: false, // 마우스 제어 이후 자동 재생을 막을지 말지
          }}
          modules={[Pagination, Autoplay]}
          className={styles.list}>
          {workData.map((item, index) => {
            return (
              <SwiperSlide key={index}>
                <div className="flex justify-center">
                  <Work
                    name={item.name}
                    img={item.img}
                    description={isEnglish ? item.description.en : item.description.kr}
                    stacks={item.stacks}
                    link={item.link}
                    company={item.company}
                  />
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
        {/* <ul className={styles.list}>
            {workData.map((item, index) => {
              return (
                <Work
                  key={index}
                  name={item.name}
                  img={item.img}
                  description={isEnglish ? item.description.en : item.description.kr}
                  stacks={item.stacks}
                  link={item.link}
                  company={item.company}
                />
              );
            })}
          </ul> */}
      </div>
    </PageWrap>
  );
};

export default WorkList;
