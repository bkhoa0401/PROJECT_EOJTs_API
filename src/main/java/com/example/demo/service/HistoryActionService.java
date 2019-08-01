package com.example.demo.service;

import com.example.demo.entity.HistoryAction;
import com.example.demo.repository.IHistoryActionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class HistoryActionService implements IHistoryActionService{

    @Autowired
    IHistoryActionRepository historyActionRepository;

    @Override
    public boolean createHistory(HistoryAction historyAction) {
        return historyActionRepository.save(historyAction) == null;
    }
}
