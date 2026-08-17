'use client';

import React from 'react';
import Work from './Work';
import { workData as defaultWorkData } from '../data/portfolioData';
import { Project } from '../service/portfolioService';
import { useUserContext } from '../context/userContext';
import PageWrap from './common/PageWrap';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface WorkListProps {
  limit?: number;
  showMoreLink?: boolean;
  useSlider?: boolean;
  initialWorks?: Project[];
}

const WorkList = ({ limit, showMoreLink = false, useSlider = false, initialWorks }: WorkListProps) => {
  const { isEnglish } = useUserContext();

  const works = initialWorks || defaultWorkData;
  const displayedWorks = limit ? works.slice(0, limit) : works;

  return (
    <PageWrap
      title="Works"
      moreLink={showMoreLink ? '/works' : undefined}
      moreText={isEnglish ? 'VIEW ALL WORKS ➔' : '전체 프로젝트 보기 ➔'}>
      <div className="w-full mt-6">
        {useSlider ? (
          <div className="w-full relative pb-4 [&_.swiper]:!pb-12 [&_.swiper-pagination-bullet]:!bg-black [&_.swiper-pagination-bullet-active]:!w-6 [&_.swiper-pagination-bullet-active]:!rounded-sm [&_.swiper-button-next]:!text-black [&_.swiper-button-prev]:!text-black [&_.swiper-button-next]:after:!text-lg [&_.swiper-button-prev]:after:!text-lg">
            <Swiper
              modules={[Pagination, Navigation, Autoplay]}
              spaceBetween={24}
              slidesPerView={1}
              breakpoints={{
                768: {
                  slidesPerView: 2,
                  spaceBetween: 24,
                },
              }}
              navigation
              pagination={{ clickable: true }}
              autoplay={{
                delay: 4500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              className="w-full">
              {displayedWorks.map((item, index) => (
                <SwiperSlide key={`work-slide-${item.id ?? 'idx'}-${item.name}-${index}`}>
                  <Work
                    name={item.name}
                    img={item.img}
                    description={isEnglish ? item.description.en : item.description.kr}
                    stacks={item.stacks}
                    link={item.link}
                    company={item.company}
                    priority={index === 0}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayedWorks.map((item, index) => (
              <Work
                key={`work-card-${item.id ?? 'idx'}-${item.name}-${index}`}
                name={item.name}
                img={item.img}
                description={isEnglish ? item.description.en : item.description.kr}
                stacks={item.stacks}
                link={item.link}
                company={item.company}
                priority={index === 0}
              />
            ))}
          </div>
        )}
      </div>
    </PageWrap>
  );
};

export default WorkList;
