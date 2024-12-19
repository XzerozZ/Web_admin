'use client'

import React from 'react'
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

const EditArticle: React.FC = () => {

const router = useRouter();
const param = useParams<{ ArticleId?: string }>();
const[ articleId, setArticleId ] = useState('')

useEffect(() => {
    if(param.ArticleId){
        setArticleId(param.ArticleId)
    }
    }, [param.ArticleId]);



  return (
    <div>articleId : {articleId}</div>
  )
}

export default EditArticle